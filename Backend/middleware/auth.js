const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authorization = req.header("Authorization");
    const headerToken = authorization?.replace(/^Bearer\s+/i, "").trim();
    const cookieToken = req.cookies?.token?.trim();
    const token = headerToken || cookieToken;

    if (!token) {
      return res.status(401).json({
        message: "Please login to access this resource",
      });
    }

    const jwtSecret = process.env.JWT_SECRET?.trim();
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth;