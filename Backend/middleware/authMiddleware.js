// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  try {
    const auth = req.header("Authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

export default protect;
export { requireAdmin };
