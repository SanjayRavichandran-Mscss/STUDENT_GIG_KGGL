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
//   // savePaymentDetails,
//   getTransactions,
//   checkPaymentStatus,
//   getExpiredProjects,
//   updateProjectExpiry,
//   NonTechStudentDetails,
//   InterviewScheduleMail,
//   ReferralMail,
//   getAllProjectsForStudentRequired,
//   getPaymentMethods,
//   getPaymentTypes,
//   saveStudentPaymentDetails,
//   getPaymentDetails,
//   saveAdminPaymentDetails
// } from "../controllers/admincontroller.js";
// import { body, validationResult } from "express-validator";
// import multer from "multer";
// import path from "path";
// import fs from "fs";


// // Multer setup for routes
// const paymentStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(process.cwd(), "public", "payment_screenshots");
//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, `student-payment-${uniqueSuffix}${ext}`);
//   },
// });

// const paymentFileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPEG, JPG, PNG, and PDF files are allowed"), false);
//   }
// };

// const paymentUpload = multer({
//   storage: paymentStorage,
//   fileFilter: paymentFileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// }).single("transaction_screenshot");

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

// adminRouter
//   .route("/save-student-payment-details")
//   .post(saveStudentPaymentDetails);
  
// // Existing routes
// adminRouter.route("/transactions").get(getTransactions);
// adminRouter.route("/check-payment/:student_id/:project_id").get(checkPaymentStatus);
// adminRouter.route("/getexpiredprojects").get(getExpiredProjects);
// adminRouter.route("/updateprojectexpiry").post(updateProjectExpiry);
// adminRouter.route("/non-tech-student-details").get(NonTechStudentDetails);
// adminRouter.route("/interview-schedule-mail").post(InterviewScheduleMail);
// adminRouter.route("/send-referral-mail").post(ReferralMail);
// adminRouter.route("/getallprojects-studentrequired").get(getAllProjectsForStudentRequired);
// adminRouter.route("/payment-methods").get(getPaymentMethods);
// adminRouter.route("/payment-types").get(getPaymentTypes);


// // Add new route after existing routes
// adminRouter.route("/get-payment-details/:student_id/:project_id").get(getPaymentDetails);

// adminRouter.route("/save-admin-payment-details").post(upload.single("transaction_screenshot"), saveAdminPaymentDetails);

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
  InterviewScheduleMail,
  ReferralMail,
  getAllProjectsForStudentRequired,





  getExpenseTypes,
  savePayableLedger,
  getPayableLedgerHistory,
  saveReceivableLedger,
  getReceivableLedgerHistory,
  getPaymentVerification,
  savePaymentVerification,
  sendExpiredUnbiddedProjectMail,
  
} from "../controllers/admincontroller.js";
import { body, validationResult } from "express-validator";
import multer from "multer";
import fs from "fs"; // For payment screenshot storage
import path from "path"; // Ensure this line is present
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






// New Multer configuration for transaction screenshots
const transactionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "public", "transaction_screenshots");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `transaction-${uniqueSuffix}${ext}`);
  },
});

const transactionUpload = multer({
  storage: transactionStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) and PDFs are allowed"));
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

adminRouter.route("/interview-schedule-mail").post(InterviewScheduleMail);

adminRouter.route('/send-referral-mail').post(ReferralMail);

adminRouter.route("/getallprojects-studentrequired").get(getAllProjectsForStudentRequired);





// New routes for payable and receivable ledgers
adminRouter.route("/expense-types").get(getExpenseTypes);



// Save payable ledger with dynamic file uploads for student transaction screenshots
adminRouter.post(
  "/save-payable-ledger",
  transactionUpload.fields(
    Array.from({ length: 10 }, (_, i) => ({
      name: `student_details[${i}][transaction_screenshot]`,
      maxCount: 1,
    }))
  ), // Supports up to 10 students
  [
    body("expense_type_id").isInt().withMessage("Expense type ID must be an integer"),
    body("project_id").isInt().withMessage("Project ID must be an integer"),
    body("client_name").isString().notEmpty().withMessage("Client name is required"),
    body("team_size").isInt({ min: 1 }).withMessage("Team size must be a positive integer"),
    body("student_details").custom((value) => {
      let parsed;
      try {
        parsed = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error("Student details must be a non-empty array");
        }
        return true;
      } catch (e) {
        throw new Error("Invalid student_details format");
      }
    }),
    body("petty_cash").isFloat({ min: 0 }).withMessage("Petty cash must be a non-negative number"),
    body("created_by").isInt().withMessage("Created by must be an integer"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, msg: "Validation failed", errors: errors.array() });
    }
    next();
  },
  savePayableLedger
);



adminRouter.route("/payable-ledger-history").get(getPayableLedgerHistory);



adminRouter.post(
  "/save-receivable-ledger",
  transactionUpload.single("transaction_screenshot"),
  [
    body("project_id").isInt().withMessage("Project ID must be an integer"),
    body("client_name").isString().notEmpty().withMessage("Client name is required"),
    body("paid_amount").isFloat({ min: 0 }).withMessage("Paid amount must be a non-negative number"),
    body("from_upi_id").isString().notEmpty().withMessage("From UPI ID is required"),
    body("to_upi_id").isString().notEmpty().withMessage("To UPI ID is required"),
    body("transaction_id").isString().notEmpty().withMessage("Transaction ID is required"),
    body("date_time").isISO8601().withMessage("Date time must be a valid ISO 8601 date"),
    body("created_by").isInt().withMessage("Created by must be an integer"),
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
  saveReceivableLedger
);


adminRouter.route("/receivable-ledger-history").get(getReceivableLedgerHistory);




// ==============================
adminRouter.post(
  "/save-payment-verification",
  transactionUpload.single("transaction_screenshot"),
  [
    body("student_id").isInt().withMessage("Student ID must be an integer"),
    body("project_id").isInt().withMessage("Project ID must be an integer"),
    body("amount").isFloat({ min: 0 }).withMessage("Amount must be a non-negative number"),
    body("date_time").isISO8601().withMessage("Date time must be a valid ISO 8601 date"),
    body("from_upi_id").isString().notEmpty().withMessage("From UPI ID is required"),
    body("to_upi_id").isString().notEmpty().withMessage("To UPI ID is required"),
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
  savePaymentVerification
);

adminRouter.route("/get-payment-verification/:student_id/:project_id").get(getPaymentVerification);


adminRouter.route("/send-expired-unbidded-mail").post(sendExpiredUnbiddedProjectMail);

export default adminRouter;