import express from "express";
import testcontroller from "../controllers/testcontroller.js";

const testRouter = express.Router();

// Skills routes
testRouter.post("/skills", testcontroller.createSkill);
testRouter.get("/skills", testcontroller.getAllSkills);
testRouter.get("/skills/active", testcontroller.getActiveSkills);
testRouter.get("/skills/:skill_id", testcontroller.getSkillById);
testRouter.put("/skills/:skill_id", testcontroller.updateSkill);
testRouter.delete("/skills/:skill_id", testcontroller.deleteSkill);

// Difficulty levels routes
testRouter.post("/difficulty-levels", testcontroller.createLevel);
testRouter.get("/difficulty-levels", testcontroller.getAllLevels);
testRouter.get("/difficulty-levels/:level_id", testcontroller.getLevelById);
testRouter.put("/difficulty-levels/:level_id", testcontroller.updateLevel);
testRouter.delete("/difficulty-levels/:level_id", testcontroller.deleteLevel);

// MCQ routes
testRouter.post("/mcq", testcontroller.createMCQ);
testRouter.get("/mcq", testcontroller.getAllMcqs);
testRouter.get("/mcq/:id", testcontroller.getMcqById);
testRouter.put("/mcq/:id", testcontroller.updateMcq);
testRouter.delete("/mcq/:id", testcontroller.deleteMcq);
testRouter.get("/mcq/by-student/:student_id", testcontroller.getMcqsByStudentSkills);

// Quiz attempts routes
testRouter.post("/attempts", testcontroller.saveQuizAttempt);
testRouter.get("/attempts/:student_id", testcontroller.getQuizAttempts);

// Test routes
testRouter.post("/create-test", testcontroller.createTest);
testRouter.get("/available-questions", testcontroller.getAvailableQuestions);
testRouter.get("/tests", testcontroller.getAllTests);
testRouter.get("/students", testcontroller.getAllStudents);
testRouter.post("/assign-test", testcontroller.assignTest);
testRouter.post("/toggle-test-status", testcontroller.toggleTestStatusForAll);
testRouter.get("/assigned-students/:test_id", testcontroller.getAssignedStudents);
testRouter.get("/all-tests/:student_id", testcontroller.getAllTestsWithQuestions);
testRouter.post("/submit-test", testcontroller.submitTest);
testRouter.get("/questions/:skill_id/:level_id", testcontroller.getQuestionsBySkillAndLevel);

// Test schedule routes
testRouter.post("/schedule", testcontroller.saveTestSchedule);
testRouter.get("/schedules/:student_id", testcontroller.getTestSchedules);

testRouter.post("/bulk-mcq", testcontroller.createBulkMcq);

testRouter.get("/student-test-attended/:student_id", testcontroller.studentTestAttended);

testRouter.post("/start-test", testcontroller.startTest);
testRouter.get("/test-time/:attempt_id", testcontroller.getTestTime);

export default testRouter;