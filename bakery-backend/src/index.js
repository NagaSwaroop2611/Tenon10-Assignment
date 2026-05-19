import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { userRouter } from "./routes/userRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = process.env.CLIENT_URL.split(",").map(origin => origin.trim());

// ---- Core Middleware ----
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json({limit: "100mb"}));
app.use(express.urlencoded({limit: "100mb", extended: true}));
app.use(cookieParser());

// --- Connect to DB ---
connectDB();

// --- Routes ---
app.use("/api/v1/bakery/user", userRouter);
app.use("/api/v1/bakery/product", productRouter);
app.use("/api/v1/bakery/order", orderRouter);

// --- Health Check ---
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "Bakery API is running 🧁" });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});
 
// --- Global Error Handler (MUST be last) ---
app.use(errorHandler);

// --- Start Server --- 
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
})