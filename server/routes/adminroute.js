// import express from "express";
// import {
//   acceptBitting,
//   addProjects,
//   addQuestion,
//   bittedInfo,
//   categories,
//   categoriesAndSub,
//   filterCollegeStduents,
//   filterStudentSkills,
//   getAllProjects,
//   getBitInfo,
//   questionCounting,
//   skillBasedProjects,
//   studentBitInfo,
//   studentsCount,
//   studentsData,
//   testAssign,
// } from "../controllers/admincontroller.js";
// import { body } from 'express-validator'
// const adminRouter = express.Router();

// adminRouter.route("/college").get(filterCollegeStduents);
// adminRouter.route("/skill").get(filterStudentSkills);
// adminRouter.route("/stucount").get(studentsCount);
// adminRouter.route('/studata').get(studentsData)
// adminRouter.route('/addproject').post(addProjects)
// adminRouter.route('/basproject/:id').get(skillBasedProjects)
// adminRouter.route('/bitinfo').post(studentBitInfo)
// adminRouter.route('/getallprojects').get(getAllProjects)
// adminRouter.route('/getbit').get(getBitInfo)
// adminRouter.route('/bittedDetail/:id').get(bittedInfo)

// adminRouter.route('/accept/:stuid/:proid').post(acceptBitting)

// // question, and quizz assigning
// adminRouter.post('/add-question',
// [
//   body('question_text').isString().notEmpty(),
//   body('correct_answer').isString().notEmpty(),
//   body('options').isArray().notEmpty(),
//   body('difficulty_level_id').isInt({ min: 1, max: 3 }),
//   body('category_id').optional().isInt(),
// ],addQuestion)
// adminRouter.route('/categories-and-subcategories').get(categoriesAndSub)
// adminRouter.route('/categories').get(categories)
// adminRouter.route('/questions/count').get(questionCounting)
// adminRouter.route('/assign-test').post(testAssign)

// export default adminRouter;


























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
} from "../controllers/admincontroller.js";
import { body } from 'express-validator'

const adminRouter = express.Router();

adminRouter.route("/college").get(filterCollegeStduents);
adminRouter.route("/skill").get(filterStudentSkills);
adminRouter.route("/stucount").get(studentsCount);
adminRouter.route('/studata').get(studentsData);
adminRouter.route('/student-details').get(studentDetails);
adminRouter.route('/addproject').post(addProjects);
adminRouter.route('/basproject/:id').get(skillBasedProjects);
adminRouter.route('/bitinfo').post(studentBitInfo);
adminRouter.route('/getallprojects').get(getAllProjects);
adminRouter.route('/getbit').get(getBitInfo);
adminRouter.route('/bittedDetail/:id').get(bittedInfo);
adminRouter.route('/accept/:stuid/:proid').post(acceptBitting);

// Question and quiz assigning
adminRouter.post('/add-question', [
  body('question_text').isString().notEmpty(),
  body('correct_answer').isString().notEmpty(),
  body('options').isArray().notEmpty(),
  body('difficulty_level_id').isInt({ min: 1, max: 3 }),
  body('category_id').optional().isInt(),
], addQuestion);
adminRouter.route('/categories-and-subcategories').get(categoriesAndSub);
adminRouter.route('/categories').get(categories);
adminRouter.route('/questions/count').get(questionCounting);
adminRouter.route('/assign-test').post(testAssign);

export default adminRouter;