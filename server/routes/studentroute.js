import express from "express";
import {
  ForgotPassword,
  GetSingleStudentData,
  Logout,
  QuizzResults,
  ResetPassword,
  StudentLogin,
  StudentProjectDetails,
  StudentRegistration,
  Verify,
  getSingleProfile,
  getStudentSkills,
  profileUpdation,
  studentDifficulty,
  studentOptionClick,
  updateUserData,
  restrictTo,
  adminDashboard,
} from "../controllers/studentcontroller.js";
import upload from "../middleware/multer.js";

const studentRouter = express.Router();

studentRouter.route("/registration").post(StudentRegistration);
studentRouter.route("/login").post(StudentLogin);
studentRouter.route("/getdata/:student_id").get(GetSingleStudentData);
studentRouter.post("/upload", upload.single("file2"), profileUpdation);
studentRouter.put("/update", upload.single("file"), updateUserData);

// Project Details
studentRouter.route("/prodeatil/:id").get(StudentProjectDetails);

// Forgot Password
studentRouter.route("/forgot").post(ForgotPassword);
studentRouter.route("/reset/:token").post(ResetPassword);

// Get Student Skill
studentRouter.route("/getSkill/:id").get(getStudentSkills);

// Get Single Profile
studentRouter.route("/getall/:id").get(getSingleProfile);

// Authentication
studentRouter.route("/auth").get(Verify);
studentRouter.route("/logout").get(Logout);

// Quiz
studentRouter.route("/questions").get(studentDifficulty);
studentRouter.route("/compare-and-submit").post(QuizzResults);

// Difficulty-based questions
studentRouter.route("/option-click").post(studentOptionClick);

// Admin Dashboard (Protected Route)
studentRouter.route("/admin/dashboard").get(restrictTo([1]), adminDashboard);

export { studentRouter };





















