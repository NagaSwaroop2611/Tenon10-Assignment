import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { cloudinary } from "../config/cloudinary.js";

// --- Register ---
// @access Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    // Role is ALWAYS customer on registration — never trust client input
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role: "customer",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        _id:        user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --- Login ---
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id:        user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --- Get Me ---
// @access Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// --- Update Profile ---
// @access Private
// Body: form-data (supports optional profilePic image upload)
const updateProfile = async (req, res, next) => {
  try {
    console.log("BODY:", req.body)
    console.log("FILE:", req.file)

    const { name, phone, address } = req.body

    const updates = {}

    if (name) updates.name = name
    if (phone) updates.phone = phone

    // ✅ parse address safely
    if (address) {
      updates.address =
        typeof address === "string"
          ? JSON.parse(address)
          : address
    }

    // ✅ image handling
    if (req.file) {
      updates.profilePic = req.file.path
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    )

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    })

  } catch (err) {
    next(err);
  }
}

// --- Change Password ---
// @access Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, password, passwordConfirm } = req.body;

    if (!currentPassword || !password || !passwordConfirm) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ success: false, message: "New passwords do not match" });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password        = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// --- Logout ---
// @access Private
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// --- Get All Users ---
// @access Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// --- Delete User ---
// @access Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete profile pic from Cloudinary if exists
    if (user.profilePicPublicId) {
      await cloudinary.uploader.destroy(user.profilePicPublicId);
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { register, login, getMe, updateProfile, changePassword, logout, getAllUsers, deleteUser };