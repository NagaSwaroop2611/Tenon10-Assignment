import jwt from "jsonwebtoken";
import "dotenv/config"
import User from "../models/User.js";


// --- protect ---
// Verifies JWT from Authorization header or cookie
// Attaches req.user on success
const protect = async (req, res, next) => {
  try {
    let token;
    if(req.headers.authorization?.startsWith("Bearer ")){
      token = req.headers.authorization.split(" ")[1];
    }else if(req.cookies?.token){
      token = req.cookies.token;
    }

    if(!token){
      return res.status(401).json({
        success: false,
        message: "Not authorised - no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");

    if(!user){
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token is invalid or has expired" });
  }
};

// --- Admin only ---
// Must be used AFTER protect middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied — admin only" });
  }
  next();
};

export {protect, adminOnly}