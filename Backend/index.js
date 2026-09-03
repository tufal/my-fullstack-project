require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { BrevoClient } = require("@getbrevo/brevo");

// Models
const User = require("./model/user");
const Contact = require("./model/contact");
const Product = require("./model/product");
const Cart = require("./model/cart");

// Middlewares & Utilities
const auth = require("./middleware/auth");
const isAdmin = require("./middleware/admin");
const Apierror = require("./utill/Apper");

const app = express();
const port = process.env.PORT || 3000;

// Body Parsers
app.use(express.json());
app.use(cookieParser());

// CORS Configuration (स्लैश हटाकर साफ़ ऑरिजिन मैचिंग)
const frontendOrigin = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : "*";

app.use(
    cors({
        origin: frontendOrigin,
        credentials: true,
    })
);
console.log("CORS configured for:", frontendOrigin);

// Brevo Client
const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

// MongoDB Atlas Connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Health Check Route
app.get('/', (req, res) => {
    res.json({
        message: 'Backend is running',
        status: 'OK'
    });
});

// Contact Route
app.post('/contact', async (req, res, next) => {
    try {
        const { email, phone } = req.body;
        if (!email || !phone) {
            throw new Apierror("Email and Phone are required", 400);
        }

        const contact = await Contact.create({ email, phone });
        return res.status(200).json({
            message: "Successfully submitted",
            contact
        });
    } catch (err) {
        next(err);
    }
});

// Register Route
app.post("/register", async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            throw new Apierror("Please fill all fields", 400);
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            throw new Apierror("User already exists", 400);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword
        });

        return res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
});

// Login Route
app.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Apierror("Please fill all fields", 400);
        }

        // Schema में select: false होने की स्थिति में password साफ़ फ़ेच हो
        const user = await User.findOne({ email }).select("+password").lean();
        if (!user) {
            throw new Apierror("Invalid Email or Password", 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Apierror("Invalid Email or Password", 400);
        }

        const jwtSecret = process.env.JWT_SECRET || "secretkey";
        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: "1h" }
        );

        // Cross-domain (Render to Vercel) के लिए सही कुकी सेटिंग्स
        const isProduction = process.env.NODE_ENV === "production" || true;
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 3600000
        });

        return res.status(200).json({
            message: user.role === 'admin' ? "Admin Login Successful" : "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
});

// Profile Route
app.get("/profile", auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            throw new Apierror("User not found", 404);
        }

        return res.status(200).json({
            user: user,
            admin: user.role === 'admin'
        });
    } catch (error) {
        next(error);
    }
});

// Logout Route
app.post("/logout", (req, res) => {
    const isProduction = process.env.NODE_ENV === "production" || true;
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax"
    });

    return res.status(200).json({
        message: "Logout Successful"
    });
});

// Product Routes
app.post("/admin/product", auth, isAdmin, async (req, res, next) => {
    try {
        const { title, description, price, image, category, stock } = req.body;

        if (!title || !description || !price || !image || !category || stock === undefined) {
            throw new Apierror("Please fill all fields", 400);
        }

        const product = await Product.create({
            title,
            description,
            price,
            image,
            category,
            stock
        });

        return res.status(201).json({
            message: "Product Created Successfully",
            product
        });
    } catch (error) {
        next(error);
    }
});

app.get("/products", async (req, res, next) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        next(error);
    }
});

app.put("/admin/products/:id", auth, isAdmin, async (req, res, next) => {
    try {
        const { title, description, price, image, category, stock } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { title, description, price, image, category, stock },
            { new: true }
        );

        if (!product) {
            throw new Apierror("Product not found", 404);
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        next(error);
    }
});

app.delete("/admin/products/:id", auth, isAdmin, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            throw new Apierror("Product not found", 404);
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            product
        });
    } catch (err) {
        next(err);
    }
});

// Cart Routes
app.post("/cartadd", auth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            throw new Apierror("Product ID is required", 400);
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Apierror("Product not found", 404);
        }

        let cart = await Cart.findOne({ user: userId, product: productId });

        if (cart) {
            cart.quantity += 1;
            await cart.save();

            return res.status(200).json({
                message: "Quantity Updated",
                cart
            });
        }

        const newCart = await Cart.create({
            user: userId,
            product: productId,
            quantity: 1
        });

        return res.status(201).json({
            message: "Product Added To Cart",
            cart: newCart
        });
    } catch (error) {
        next(error);
    }
});

app.post("/cartdecrease", auth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: userId, product: productId });
        if (!cart) {
            throw new Apierror("Cart item not found", 404);
        }

        if (cart.quantity > 1) {
            cart.quantity -= 1;
            await cart.save();

            return res.status(200).json({
                message: "Quantity Decreased",
                cart
            });
        }

        await cart.deleteOne();
        return res.status(200).json({
            message: "Product removed from cart"
        });
    } catch (error) {
        next(error);
    }
});

app.get("/cartshow", auth, async (req, res, next) => {
    try {
        const cart = await Cart.find({ user: req.user.id }).populate("product");

        if (cart.length === 0) {
            return res.status(200).json({
                message: "Cart is empty",
                cart: []
            });
        }

        return res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
});

app.delete("/cartremove/:id", auth, async (req, res, next) => {
    try {
        const cartitem = await Cart.findByIdAndDelete(req.params.id);

        if (!cartitem) {
            throw new Apierror("Cart item not found", 404);
        }

        return res.status(200).json({
            message: "Cart item removed successfully"
        });
    } catch (err) {
        next(err);
    }
});

// Forgot & Reset Password
app.post("/forgotpassword", async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new Apierror("Email is required", 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Apierror("User not found with this email", 404);
        }

        const jwtSecret = process.env.JWT_SECRET || "secretkey";
        const changePasswordToken = jwt.sign(
            { id: user._id },
            jwtSecret,
            { expiresIn: "1h" }
        );

       
        const resetLink = `${frontendOrigin}/resetpassword/${changePasswordToken}`;

        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: "My E-Commerce",
                email: "tufelmansuri89@gmail.com"
            },
            to: [{ email: user.email }],
            subject: "Reset Your Password",
            htmlContent: `
                <h2>Password Reset</h2>
                <p>Hello,</p>
                <p>You requested to reset your password.</p>
                <p>Click the button below to create a new password:</p>
                <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#007bff;color:white;text-decoration:none;border-radius:6px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
            `
        });

        return res.status(200).json({
            message: "Password reset link sent to your email"
        });
    } catch (err) {
        next(err);
    }
});

app.post("/resetpassword/:token", async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            throw new Apierror("New password is required", 400);
        }

        let decoded;
        try {
            const jwtSecret = process.env.JWT_SECRET || "secretkey";
            decoded = jwt.verify(token, jwtSecret);
        } catch (jwtErr) {
            throw new Apierror("Invalid or expired reset token", 401);
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Apierror("User not found", 404);
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully"
        });
    } catch (err) {
        next(err);
    }
});

// Global Error Handling Middleware (Always at the end of routes)
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = Number(err.statusCode || err.status);
    if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) {
        statusCode = 500;
    }

    let message = err.message || "Internal Server Error";

    if (err.name === "CastError") {
        statusCode = 400;
        message = `Resource not found. Invalid: ${err.path}`;
    }

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0] || "Field";
        message = `${field} already exists`;
    }

    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token, please login again";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired, please login again";
    }

    if (statusCode === 500) {
        console.error("🔥 SERVER ERROR:", err);
    }

    return res.status(statusCode).json({
        success: false,
        message
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});