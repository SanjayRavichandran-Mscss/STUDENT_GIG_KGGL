import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import  studentRouter  from "./routes/studentroute.js";
import  collegeRouter  from "./routes/collegeroute.js";
import Verification from "./middleware/Verification.js";
import adminRouter from "./routes/adminroute.js";
import testRouter from "./routes/testroutes.js";
import path from "path";
import multer from "multer";

const app = express();
dotenv.config();

// Middleware
app.use(
  cors({
    origin: ["http://103.118.158.24:3000", "http://103.118.158.24:5173", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Custom middleware to add CORS headers to static files
app.use("/payment_screenshots", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Serve static files
app.use(express.static(path.join(process.cwd(), "public")));

// Routes
app.use("/api/stu", studentRouter);
app.use("/api/college", collegeRouter);
app.use("/api/verify", Verification, studentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/test", testRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World...");
});

// Error handling for multer and other errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ status: false, msg: "File upload error", error: err.message });
  } else if (err) {
    console.error("Server error:", err);
    return res.status(500).json({ status: false, msg: "Server error", error: err.message });
  }
  next();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 




