// import express from "express";
// import {
//   acceptBitting,
//   addProjects,
//   addQuestion,
//   bittedInfo,
//   filterCollegeStduents,
//   filterStudentSkills,
//   getAllProjects,
//   getBitInfo,
//   skillBasedProjects,
//   studentBitInfo,
//   studentsCount,
//   studentDetails,
//   checkBidStatus,
//   declineBitting,
//   getAllStudentAndTestData,
//   testsByStudentSkillsCount,
//   allStudentsTestsBySkillsCount,
//   getAcceptedBits,
//   getBitStatuses,
//   updateBitStatus,
//   savePaymentDetails,
//   getTransactions,
//   checkPaymentStatus,
//     getExpiredProjects,
//     updateProjectExpiry,
//     NonTechStudentDetails,
//     InterviewScheduleMail

// } from "../controllers/admincontroller.js";
// import { body, validationResult } from "express-validator"; // Added validationResult import
// import multer from "multer"; // Added multer for file uploads
// import path from "path";

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/payment_screenshots/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images (jpeg, jpg, png) are allowed"));
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// const adminRouter = express.Router();

// // Existing routes
// adminRouter.route("/college").get(filterCollegeStduents);
// adminRouter.route("/skill").get(filterStudentSkills);
// adminRouter.route("/stucount").get(studentsCount);
// adminRouter.route("/student-details").get(studentDetails);
// adminRouter.route("/addproject").post(addProjects);
// adminRouter.route("/basproject/:id").get(skillBasedProjects);
// adminRouter.route("/bitinfo").post(studentBitInfo);
// adminRouter.route("/getallprojects").get(getAllProjects);
// adminRouter.route("/getbit").get(getBitInfo);
// adminRouter.route("/bittedDetail/:id").get(bittedInfo);
// adminRouter.route("/accept/:stuid/:proid").post(acceptBitting);
// adminRouter.route("/decline/:stuid/:proid").post(declineBitting);
// adminRouter.route("/studentDataAndTest").get(getAllStudentAndTestData);
// adminRouter.route("/accepted-bits").get(getAcceptedBits);
// adminRouter.route("/bit-statuses").get(getBitStatuses);

// adminRouter.route("/update-bit-status").post(
//   [
//     body("bit_id").isInt(),
//     body("student_id").isInt(),
//     body("project_id").isInt(),
//     body("bit_status_id").isInt(),
//     body("email").isEmail(),
//   ],
//   updateBitStatus
// );

// // Question and quiz assigning
// adminRouter.post(
//   "/add-question",
//   [
//     body("question_text").isString().notEmpty(),
//     body("correct_answer").isString().notEmpty(),
//     body("options").isArray().notEmpty(),
//     body("difficulty_level_id").isInt({ min: 1, max: 3 }),
//     body("category_id").optional().isInt(),
//   ],
//   addQuestion
// );

// adminRouter.route("/checkBid/:stuid/:proid").get(checkBidStatus);
// adminRouter.route("/tests-by-skills/:student_id").get(testsByStudentSkillsCount);
// adminRouter.route("/all-students-tests-by-skills").get(allStudentsTestsBySkillsCount);

// // Save payment details route
// adminRouter.post(
//   "/save-payment-details",
//   upload.single("transaction_screenshot"), // Handle file upload
//   [
//     body("student_id").isInt().withMessage("Student ID must be an integer"),
//     body("project_id").isInt().withMessage("Project ID must be an integer"),
//     body("from_account_number").isString().notEmpty().withMessage("From account number is required"),
//     body("to_account_number").isString().notEmpty().withMessage("To account number is required"),
//     body("transaction_id").isString().notEmpty().withMessage("Transaction ID is required"),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ status: false, msg: "Validation failed", errors: errors.array() });
//     }
//     if (!req.file) {
//       return res.status(400).json({ status: false, msg: "Transaction screenshot is required" });
//     }
//     next();
//   },
//   savePaymentDetails
// );



// adminRouter.route("/transactions").get(getTransactions);

// adminRouter.route("/check-payment/:student_id/:project_id").get(checkPaymentStatus);

// adminRouter.route("/getexpiredprojects").get(getExpiredProjects);
// adminRouter.route("/updateprojectexpiry").post(updateProjectExpiry);

// adminRouter.route("/non-tech-student-details").get(NonTechStudentDetails);

// adminRouter.route("/interview-schedule-mail").post(upload.array("attachments", 5), InterviewScheduleMail);

// export default adminRouter;















import express from "express";
import {
  acceptBitting,
  addProjects,
  addQuestion,
  bittedInfo,
  filterCollegeStduents,
  filterStudentSkills,
  getAllProjects,
  getBitInfo,
  skillBasedProjects,
  studentBitInfo,
  studentsCount,
  studentDetails,
  checkBidStatus,
  declineBitting,
  getAllStudentAndTestData,
  testsByStudentSkillsCount,
  allStudentsTestsBySkillsCount,
  getAcceptedBits,
  getBitStatuses,
  updateBitStatus,
  savePaymentDetails,
  getTransactions,
  checkPaymentStatus,
  getExpiredProjects,
  updateProjectExpiry,
  NonTechStudentDetails,
  InterviewScheduleMail
} from "../controllers/admincontroller.js";
import { body, validationResult } from "express-validator";
import multer from "multer";
import fs from "fs"; // For payment screenshot storage

const adminRouter = express.Router();

// Multer configuration for payment screenshots
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.cwd() + "/public/payment_screenshots/";
    fs.mkdirSync(uploadPath, { recursive: true }); // Line ~36
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|mp3|wav|mp4|avi|mov/;
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png), PDFs, audio (mp3, wav), and videos (mp4, avi, mov) are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Existing routes
adminRouter.route("/college").get(filterCollegeStduents);
adminRouter.route("/skill").get(filterStudentSkills);
adminRouter.route("/stucount").get(studentsCount);
adminRouter.route("/student-details").get(studentDetails);
adminRouter.route("/addproject").post(addProjects);
adminRouter.route("/basproject/:id").get(skillBasedProjects);
adminRouter.route("/bitinfo").post(studentBitInfo);
adminRouter.route("/getallprojects").get(getAllProjects);
adminRouter.route("/getbit").get(getBitInfo);
adminRouter.route("/bittedDetail/:id").get(bittedInfo);
adminRouter.route("/accept/:stuid/:proid").post(acceptBitting);
adminRouter.route("/decline/:stuid/:proid").post(declineBitting);
adminRouter.route("/studentDataAndTest").get(getAllStudentAndTestData);
adminRouter.route("/accepted-bits").get(getAcceptedBits);
adminRouter.route("/bit-statuses").get(getBitStatuses);

adminRouter.route("/update-bit-status").post(
  [
    body("bit_id").isInt(),
    body("student_id").isInt(),
    body("project_id").isInt(),
    body("bit_status_id").isInt(),
    body("email").isEmail(),
  ],
  updateBitStatus
);

// Question and quiz assigning
adminRouter.post(
  "/add-question",
  [
    body("question_text").isString().notEmpty(),
    body("correct_answer").isString().notEmpty(),
    body("options").isArray().notEmpty(),
    body("difficulty_level_id").isInt({ min: 1, max: 3 }),
    body("category_id").optional().isInt(),
  ],
  addQuestion
);

adminRouter.route("/checkBid/:stuid/:proid").get(checkBidStatus);
adminRouter.route("/tests-by-skills/:student_id").get(testsByStudentSkillsCount);
adminRouter.route("/all-students-tests-by-skills").get(allStudentsTestsBySkillsCount);

// Save payment details route
adminRouter.post(
  "/save-payment-details",
  upload.single("transaction_screenshot"),
  [
    body("student_id").isInt().withMessage("Student ID must be an integer"),
    body("project_id").isInt().withMessage("Project ID must be an integer"),
    body("from_account_number").isString().notEmpty().withMessage("From account number is required"),
    body("to_account_number").isString().notEmpty().withMessage("To account number is required"),
    body("transaction_id").isString().notEmpty().withMessage("Transaction ID is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, msg: "Validation failed", errors: errors.array() });
    }
    if (!req.file) {
      return res.status(400).json({ status: false, msg: "Transaction screenshot is required" });
    }
    next();
  },
  savePaymentDetails
);

adminRouter.route("/transactions").get(getTransactions);
adminRouter.route("/check-payment/:student_id/:project_id").get(checkPaymentStatus);
adminRouter.route("/getexpiredprojects").get(getExpiredProjects);
adminRouter.route("/updateprojectexpiry").post(updateProjectExpiry);
adminRouter.route("/non-tech-student-details").get(NonTechStudentDetails);
adminRouter.post("/interview-schedule-mail", InterviewScheduleMail);

export default adminRouter;