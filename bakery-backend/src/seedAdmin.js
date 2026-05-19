import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const adminExists = await User.findOne({ email: "swaroopsreepuram2611@bakery.com" });
    if (adminExists) {
      console.log("⚠️  Admin already exists:", adminExists.email);
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = await User.create({
      name:            "Admin",
      email:           "swaroopsreepuram2611@bakery.com",
      password:        "admin123",
      passwordConfirm: "admin123",
      role:            "admin",
    });

    console.log("🎉 Admin created successfully!");
    console.log("   Email   :", admin.email);
    console.log("   Password: admin123  ← change this after first login");
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();