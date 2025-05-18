import express from "express";
import multer from "multer";
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
  getStudentDataAndTest,
  getBidCredits,
  updateBidCredits,
  checkDuplicateLinks,
  VerifyPasskey,
  CheckEmailExists,
} from "../controllers/studentcontroller.js";
import upload from "../middleware/multer.js";

const studentRouter = express.Router();

// Multer error handling middleware
const handleMulterErrors = (req, res, next) => {
  upload.single(req.multerFieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: "error",
        message: `Multer error: ${err.message}`,
        field: err.field || null,
      });
    } else if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
    next();
  });
};

// Routes
studentRouter.route("/registration").post(StudentRegistration);
studentRouter.route("/login").post(StudentLogin);
studentRouter.route("/getdata/:student_id").get(GetSingleStudentData);

// File upload route for profile updation
studentRouter.route("/upload").post(
  (req, res, next) => {
    req.multerFieldName = "file";
    handleMulterErrors(req, res, next);
  },
  profileUpdation
);

// File upload route for user data update
studentRouter.route("/update").put(
  (req, res, next) => {
    req.multerFieldName = "file";
    handleMulterErrors(req, res, next);
  },
  updateUserData
);

// Check duplicate GitHub/LinkedIn links
studentRouter.route("/check-links").post(checkDuplicateLinks);

// Project Details
studentRouter.route("/prodeatil/:id").get(StudentProjectDetails);

// Forgot Password and Reset
studentRouter.route("/check-email").post(CheckEmailExists);
studentRouter.route("/forgot").post(ForgotPassword);
studentRouter.route("/verify-passkey").post(VerifyPasskey);
studentRouter.route("/reset").post(ResetPassword);

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

studentRouter.route("/student-test-data/:id").get(getStudentDataAndTest);

// Student Bid Credits
studentRouter.route("/getBidCredits/:id").get(getBidCredits);
studentRouter.route("/updateBidCredits/:id").put(updateBidCredits);

export { studentRouter };