import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split("")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not Found"
                });
            }
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res
                    .status(401)
                    .json({ success: false, message: "Token expired,please log in again" });
            }
            return res.status(401).json({ success: false, message: "Unauthorized,invalid token" });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: "Unauthorized, no token provided"
        });
    }
};


const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Forbidden:Admin access only"
        });
    }
};

export { protect, admin };
