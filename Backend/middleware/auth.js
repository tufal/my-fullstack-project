const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    console.log("========== AUTH ==========");
    console.log("COOKIES:", req.cookies);
    console.log("TOKEN:", req.cookies?.token);

    const authorization = req.header("Authorization");
    const token = authorization?.replace(/^Bearer\s+/i, "") || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login to access this resource",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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