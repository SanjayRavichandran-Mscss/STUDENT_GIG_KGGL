import express from "express";
import quizController from "../controllers/quizController.js";

const quizRouter = express.Router();

// Skills routes
quizRouter.post("/skills", quizController.createSkill);
quizRouter.get("/skills", quizController.getAllSkills);
quizRouter.get("/skills/:skill_id", quizController.getSkillById);
quizRouter.put("/skills/:skill_id", quizController.updateSkill);
quizRouter.delete("/skills/:skill_id", quizController.deleteSkill);

// Difficulty levels routes
quizRouter.post("/difficulty-levels", quizController.createLevel);
quizRouter.get("/difficulty-levels", quizController.getAllLevels);
quizRouter.get("/difficulty-levels/:level_id", quizController.getLevelById);
quizRouter.put("/difficulty-levels/:level_id", quizController.updateLevel);
quizRouter.delete("/difficulty-levels/:level_id", quizController.deleteLevel);

// MCQ routes
quizRouter.post("/mcq", quizController.createMCQ);
quizRouter.get("/mcq", quizController.getAllMcqs);
quizRouter.get("/mcq/:id", quizController.getMcqById);
quizRouter.put("/mcq/:id", quizController.updateMcq);
quizRouter.delete("/mcq/:id", quizController.deleteMcq);
quizRouter.get("/mcq/by-student/:student_id", quizController.getMcqsByStudentSkills);

// Quiz attempts routes
quizRouter.post("/attempts", quizController.saveQuizAttempt);
quizRouter.get("/attempts/:student_id", quizController.getQuizAttempts);

// Test routes
quizRouter.post("/create-test", quizController.createTest);
quizRouter.get("/available-questions", quizController.getAvailableQuestions);
quizRouter.get("/tests", quizController.getAllTests);
quizRouter.get("/students", quizController.getAllStudents);
quizRouter.post("/assign-test", quizController.assignTest);
quizRouter.get("/assigned-students/:test_id", quizController.getAssignedStudents);
quizRouter.get("/assigned-tests/:student_id", quizController.getAssignedTestsWithQuestions);
quizRouter.post("/submit-test", quizController.submitTest);

export default quizRouter;

