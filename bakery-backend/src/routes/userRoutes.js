import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  getAllUsers,
  deleteUser,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

export const userRouter = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
userRouter.post("/register", register);
userRouter.post("/login", login);

// ── Private routes ────────────────────────────────────────────────────────────
userRouter.post("/logout", protect, logout);
userRouter.get("/me", protect, getMe);
userRouter.put("/update-profile", protect, upload.single("profilePic"), updateProfile);
userRouter.put("/change-password",protect, changePassword);


// ── Admin routes ──────────────────────────────────────────────────────────────
userRouter.get("/all", protect, adminOnly, getAllUsers);
userRouter.delete("/:id", protect, adminOnly, deleteUser);