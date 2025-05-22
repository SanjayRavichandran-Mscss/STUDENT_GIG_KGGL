import express from "express";
import {
  acceptBitting,
  addProjects,
  addQuestion,
  bittedInfo,
  categories,
  categoriesAndSub,
  filterCollegeStduents,
  filterStudentSkills,
  getAllProjects,
  getBitInfo,
  questionCounting,
  skillBasedProjects,
  studentBitInfo,
  studentsCount,
  studentsData,
  studentDetails,
  testAssign,
  checkBidStatus,
  declineBitting,
  getAllStudentAndTestData,
  testsByStudentSkillsCount,
  allStudentsTestsBySkillsCount,
  getAcceptedBits,
  getBitStatuses,
  updateBitStatus,
  savePaymentDetails,
} from "../controllers/admincontroller.js";
import { body, validationResult } from "express-validator"; // Added validationResult import
import multer from "multer"; // Added multer for file uploads
import path from "path";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/payment_screenshots/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const adminRouter = express.Router();

// Existing routes
adminRouter.route("/college").get(filterCollegeStduents);
adminRouter.route("/skill").get(filterStudentSkills);
adminRouter.route("/stucount").get(studentsCount);
adminRouter.route("/studata").get(studentsData);
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
adminRouter.route("/categories-and-subcategories").get(categoriesAndSub);
adminRouter.route("/categories").get(categories);
adminRouter.route("/questions/count").get(questionCounting);
adminRouter.route("/assign-test").post(testAssign);
adminRouter.route("/checkBid/:stuid/:proid").get(checkBidStatus);
adminRouter.route("/tests-by-skills/:student_id").get(testsByStudentSkillsCount);
adminRouter.route("/all-students-tests-by-skills").get(allStudentsTestsBySkillsCount);

// Save payment details route
adminRouter.post(
  "/save-payment-details",
  upload.single("transaction_screenshot"), // Handle file upload
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

export default adminRouter;