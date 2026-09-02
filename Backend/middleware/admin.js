const User = require("../model/user");

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
        return res.status(403).json({
            message: "Access Denied",
        });
    }

    next();
};

module.exports = isAdmin;