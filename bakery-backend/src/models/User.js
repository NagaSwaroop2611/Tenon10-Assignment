import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, "Name is required"],
      trim:      true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      validate: [validator.isEmail, "Please enter a valid email Id"],
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select:    false,
    },
    passwordConfirm: {
      type:     String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
    role: {
      type:    String,
      enum:    ["customer", "admin"],
      default: "customer",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street:  String,
      city:    String,
      state:   String,
      pincode: String,
    },
    profilePic: {
      type:    String,
      default: "",
    },
    profilePicPublicId: {
      type:    String,
      default: "",
    },
  },
  { timestamps: true }
);

// Mongoose 7/8: async pre hooks do NOT receive next
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password        = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;