import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { studentRouter } from "./routes/studentroute.js";
import { collegeRouter } from "./routes/collegeroute.js";
import Verification from "./middleware/Verification.js";
import adminRouter from "./routes/adminroute.js";
import quizRouter from "./routes/quizRoutes.js";

const app = express();

dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/stu", studentRouter);
app.use("/college", collegeRouter);
app.use("/verify", Verification, studentRouter);
app.use("/admin", adminRouter);
app.use("/api/quiz", quizRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
