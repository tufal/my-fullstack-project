const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    console.log("TOKEN:", token ? "Token received" : "No token");

    if (!token) {
      return res.status(401).json({
        message: "Please login to access this resource",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED USER:", decoded);

    req.user = decoded;

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth;