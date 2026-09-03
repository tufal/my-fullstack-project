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

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
console.log("CORS configured for:", process.env.FRONTEND_URL);
// Brevo
const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

// MongoDB Atlas
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World',
        greeting: 'hii tufel'
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
        res.status(200).json({
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

        res.status(201).json({
            message: "User Registered Successfully",
            user
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

        const user = await User.findOne({ email }).lean();
        if (!user) {
            throw new Apierror("Invalid Email or Password", 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Apierror("Invalid Email or Password", 400);
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            "secretkey",
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
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
    } } catch (error) {
        console.error("🔥 ACTUAL LOGIN ERROR:", error); // यह Render logs में असली गलती दिखाएगा
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});

// Profile Route
app.get("/profile", auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            throw new Apierror("User not found", 404);
        }

        res.status(200).json({
            user: user,
            admin: user.role === 'admin'
        });
    } catch (error) {
        next(error);
    }
});

// Logout Route
app.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    res.status(200).json({
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
        const product = await Product.findByIdAndUpdate(req.params.id, {
            title,
            description,
            price,
            image,
            category,
            stock
        }, { new: true });

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

        const changePasswordToken = jwt.sign(
            { id: user._id },
            "secretkey",
            { expiresIn: "1h" }
        );

        const resetLink = `http://localhost:5173/resetpassword/${changePasswordToken}`;

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
            decoded = jwt.verify(token, "secretkey");
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


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});