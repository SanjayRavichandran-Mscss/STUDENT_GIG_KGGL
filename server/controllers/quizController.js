// import QuizModel from "../models/quizModel.js";

// // Create skill
// const createSkill = async (req, res) => {
//   try {
//     const skillData = req.body;
//     if (!skillData.skill_name) {
//       return res.status(400).json({ msg: "Skill name is required" });
//     }
//     const result = await QuizModel.createSkill(skillData);
//     return res.status(201).json({ msg: "Skill created successfully", skill_id: result.insertId });
//   } catch (error) {
//     console.error("Error in createSkill:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get all skills
// const getAllSkills = async (req, res) => {
//   try {
//     const skills = await QuizModel.getAllSkills();
//     return res.status(200).json(skills);
//   } catch (error) {
//     console.error("Error in getAllSkills:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get skill by ID
// const getSkillById = async (req, res) => {
//   try {
//     const skill = await QuizModel.getSkillById(req.params.skill_id);
//     if (!skill) {
//       return res.status(404).json({ msg: "Skill not found" });
//     }
//     return res.status(200).json(skill);
//   } catch (error) {
//     console.error("Error in getSkillById:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Update skill
// const updateSkill = async (req, res) => {
//   try {
//     const result = await QuizModel.updateSkill(req.params.skill_id, req.body);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ msg: "Skill not found" });
//     }
//     return res.status(200).json({ msg: "Skill updated successfully" });
//   } catch (error) {
//     console.error("Error in updateSkill:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Delete skill
// const deleteSkill = async (req, res) => {
//   try {
//     const result = await QuizModel.deleteSkill(req.params.skill_id);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ msg: "Skill not found" });
//     }
//     return res.status(200).json({ msg: "Skill deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteSkill:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Create difficulty level
// const createLevel = async (req, res) => {
//   try {
//     const levelData = req.body;
//     if (!levelData.level_name) {
//       return res.status(400).json({ msg: "Level name is required" });
//     }
//     const result = await QuizModel.createLevel(levelData);
//     return res.status(201).json({ msg: "Level created successfully", level_id: result.insertId });
//   } catch (error) {
//     console.error("Error in createLevel:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get all difficulty levels
// const getAllLevels = async (req, res) => {
//   try {
//     const levels = await QuizModel.getAllLevels();
//     return res.status(200).json(levels);
//   } catch (error) {
//     console.error("Error in getAllLevels:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get difficulty level by ID
// const getLevelById = async (req, res) => {
//   try {
//     const level = await QuizModel.getLevelById(req.params.level_id);
//     if (!level) {
//       return res.status(404).json({ msg: "Level not found" });
//     }
//     return res.status(200).json(level);
//   } catch (error) {
//     console.error("Error in getLevelById:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Update difficulty level
// const updateLevel = async (req, res) => {
//   try {
//     const result = await QuizModel.updateLevel(req.params.level_id, req.body);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ msg: "Level not found" });
//     }
//     return res.status(200).json({ msg: "Level updated successfully" });
//   } catch (error) {
//     console.error("Error in updateLevel:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Delete difficulty level
// const deleteLevel = async (req, res) => {
//   try {
//     const result = await QuizModel.deleteLevel(req.params.level_id);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ msg: "Level not found" });
//     }
//     return res.status(200).json({ msg: "Level deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteLevel:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Create MCQ
// const createMCQ = async (req, res) => {
//   try {
//     const mcqData = req.body;
//     if (!mcqData.questions || !mcqData.option || !mcqData.correct_answer || !mcqData.skill_id || !mcqData.difficulty_level_id) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }
//     mcqData.option = JSON.stringify(mcqData.option);
//     const result = await QuizModel.createMCQ(mcqData);
//     return res.status(201).json({ msg: "MCQ created successfully", id: result.insertId });
//   } catch (error) {
//     console.error("Error in createMCQ:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get all MCQs
// const getAllMcqs = async (req, res) => {
//   try {
//     const mcqs = await QuizModel.getAllMcqs();
//     const parsedMcqs = mcqs.map((mcq) => ({
//       ...mcq,
//       option: JSON.parse(mcq.option),
//     }));
//     return res.status(200).json(parsedMcqs);
//   } catch (error) {
//     console.error("Error in getAllMcqs:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get MCQ by ID
// const getMcqById = async (req, res) => {
//   try {
//     const mcq = await QuizModel.getMcqById(req.params.id);
//     if (!mcq) {
//       return res.status(404).json({ msg: "MCQ not found" });
//     }
//     mcq.option = JSON.parse(mcq.option);
//     return res.status(200).json(mcq);
//   } catch (error) {
//     console.error("Error in getMcqById:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Update MCQ
// const updateMcq = async (req, res) => {
//   try {
//     const mcqData = req.body;
//     if (mcqData.option) {
//       mcqData.option = JSON.stringify(mcqData.option);
//     }
//     const result = await QuizModel.updateMcq(req.params.id, mcqData);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ msg: "MCQ not found" });
//     }
//     return res.status(200).json({ msg: "MCQ updated successfully" });
//   } catch (error) {
//     console.error("Error in updateMcq:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Delete MCQ
// const deleteMcq = async (req, res) => {
//   try {
//     const result = await QuizModel.deleteMcq(req.params.id);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ msg: "MCQ not found" });
//     }
//     return res.status(200).json({ msg: "MCQ deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteMcq:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get MCQs by student skills
// const getMcqsByStudentSkills = async (req, res) => {
//   try {
//     const { student_id } = req.params;
//     const mcqs = await QuizModel.getMcqsByStudentSkills(student_id);
//     if (mcqs.length === 0) {
//       return res.status(404).json({ msg: "No MCQs found for this student's skills" });
//     }
//     const parsedMcqs = mcqs.map((mcq) => ({
//       ...mcq,
//       option: JSON.parse(mcq.option),
//     }));
//     return res.status(200).json(parsedMcqs);
//   } catch (error) {
//     console.error("Error in getMcqsByStudentSkills:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get entry test questions
// const getEntryTestQuestions = async (req, res) => {
//   try {
//     const { student_id } = req.params;
//     const questions = await QuizModel.getEntryTestQuestionsByStudentSkills(student_id);
//     if (questions.length === 0) {
//       return res.status(404).json({ msg: "No questions found for this student's skills" });
//     }
//     const parsedQuestions = questions.map((q) => ({
//       ...q,
//       option: JSON.parse(q.option),
//     }));
//     return res.status(200).json(parsedQuestions);
//   } catch (error) {
//     console.error("Error in getEntryTestQuestions:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Submit entry test
// const submitEntryTest = async (req, res) => {
//   try {
//     const { student_id, answers } = req.body;
//     if (!student_id || !answers || typeof answers !== "object") {
//       return res.status(400).json({ msg: "Student ID and answers are required" });
//     }
//     const questions = await QuizModel.getEntryTestQuestionsByStudentSkills(student_id);
//     if (questions.length === 0) {
//       return res.status(404).json({ msg: "No questions found for this student" });
//     }
//     let correctCount = 0;
//     const totalQuestions = questions.length;
//     const answerDetails = {};
//     questions.forEach((q) => {
//       const submittedAnswer = answers[q.id];
//       const isCorrect = submittedAnswer === q.correct_answer;
//       if (isCorrect) correctCount += 1;
//       answerDetails[q.id] = {
//         question: q.questions,
//         submitted_answer: submittedAnswer,
//         correct_answer: q.correct_answer,
//         is_correct: isCorrect,
//       };
//     });
//     const percentage = (correctCount / totalQuestions) * 100;
//     const resultData = {
//       student_id,
//       total_questions: totalQuestions,
//       correct_answers: correctCount,
//       incorrect_answers: totalQuestions - correctCount,
//       percentage,
//       answer_details: JSON.stringify(answerDetails),
//     };
//     const result = await QuizModel.saveEntryTestResult(resultData);
//     return res.status(201).json({
//       msg: "Entry test submitted successfully",
//       result_id: result.insertId,
//       percentage,
//       correctCount,
//       totalQuestions,
//     });
//   } catch (error) {
//     console.error("Error in submitEntryTest:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Save quiz attempt
// const saveQuizAttempt = async (req, res) => {
//   try {
//     const attemptData = req.body;
//     if (
//       !attemptData.student_id ||
//       !attemptData.skill_id ||
//       !attemptData.difficulty_level_id ||
//       !attemptData.questions ||
//       !attemptData.correct_answer ||
//       !attemptData.selected_option
//     ) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }
//     attemptData.questions = JSON.stringify(attemptData.questions);
//     attemptData.correct_answer = JSON.stringify(attemptData.correct_answer);
//     attemptData.selected_option = JSON.stringify(attemptData.selected_option);
//     const result = await QuizModel.createQuizAttempt(attemptData);
//     return res.status(201).json({ msg: "Quiz attempt saved successfully", attempt_id: result.insertId });
//   } catch (error) {
//     console.error("Error in saveQuizAttempt:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get quiz attempts
// const getQuizAttempts = async (req, res) => {
//   try {
//     const attempts = await QuizModel.getQuizAttemptsByStudentId(req.params.student_id);
//     if (attempts.length === 0) {
//       return res.status(404).json({ msg: "No quiz attempts found for this student" });
//     }
//     const parsedAttempts = attempts.map((attempt) => ({
//       ...attempt,
//       questions: JSON.parse(attempt.questions),
//       correct_answer: JSON.parse(attempt.correct_answer),
//       selected_option: JSON.parse(attempt.selected_option),
//     }));
//     return res.status(200).json(parsedAttempts);
//   } catch (error) {
//     console.error("Error in getQuizAttempts:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Create test
// const createTest = async (req, res) => {
//   try {
//     const testData = req.body;
//     if (
//       !testData.test_name ||
//       !testData.skill_id ||
//       !testData.difficulty_level_id ||
//       !testData.easy_level_question ||
//       !testData.medium_level_question ||
//       !testData.hard_level_question ||
//       !testData.total_no_of_questions ||
//       !testData.easy_pass_mark ||
//       !testData.medium_pass_mark ||
//       !testData.hard_pass_mark
//     ) {
//       return res.status(400).json({ msg: "All test fields are required" });
//     }
//     const availableQuestions = await QuizModel.getAvailableQuestions(
//       testData.skill_id,
//       testData.difficulty_level_id
//     );
//     const easyQuestions = availableQuestions.filter((q) => q.difficulty_level_id === 1);
//     const mediumQuestions = availableQuestions.filter((q) => q.difficulty_level_id === 2);
//     const hardQuestions = availableQuestions.filter((q) => q.difficulty_level_id === 3);
//     if (testData.easy_level_question > easyQuestions.length) {
//       return res.status(400).json({
//         msg: `Not enough easy questions available. Required: ${testData.easy_level_question}, Available: ${easyQuestions.length}`,
//       });
//     }
//     if (testData.difficulty_level_id >= 2 && testData.medium_level_question > mediumQuestions.length) {
//       return res.status(400).json({
//         msg: `Not enough medium questions available. Required: ${testData.medium_level_question}, Available: ${mediumQuestions.length}`,
//       });
//     }
//     if (testData.difficulty_level_id === 3 && testData.hard_level_question > hardQuestions.length) {
//       return res.status(400).json({
//         msg: `Not enough hard questions available. Required: ${testData.hard_level_question}, Available: ${hardQuestions.length}`,
//       });
//     }
//     const result = await QuizModel.createTest(testData);
//     return res.status(201).json({ msg: "Test created successfully", test_id: result.insertId });
//   } catch (error) {
//     console.error("Error in createTest:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get available questions
// const getAvailableQuestions = async (req, res) => {
//   try {
//     const { skill_id, level_id } = req.query;
//     const questions = await QuizModel.getAvailableQuestions(skill_id, level_id);
//     const parsedQuestions = questions.map((q) => ({
//       ...q,
//       option: JSON.parse(q.option),
//     }));
//     return res.status(200).json(parsedQuestions);
//   } catch (error) {
//     console.error("Error in getAvailableQuestions:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get all tests
// const getAllTests = async (req, res) => {
//   try {
//     const tests = await QuizModel.getAllTests();
//     return res.status(200).json(tests);
//   } catch (error) {
//     console.error("Error in getAllTests:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get all students
// const getAllStudents = async (req, res) => {
//   try {
//     const students = await QuizModel.getAllStudents();
//     return res.status(200).json(students);
//   } catch (error) {
//     console.error("Error in getAllStudents:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Assign test
// const assignTest = async (req, res) => {
//   try {
//     const { test_id, student_ids, active_status = 0 } = req.body;
//     if (!test_id || !student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
//       return res.status(400).json({ msg: "Test ID and student IDs are required" });
//     }
//     const assignmentData = student_ids.map((student_id) => ({ test_id, student_id, active_status }));
//     const result = await QuizModel.assignTest(assignmentData);
//     return res.status(201).json({ msg: "Test assigned successfully", affectedRows: result.affectedRows });
//   } catch (error) {
//     console.error("Error in assignTest:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Toggle test status for all students
// const toggleTestStatusForAll = async (req, res) => {
//   try {
//     const { test_id, active_status } = req.body;
//     if (!test_id || active_status === undefined) {
//       return res.status(400).json({ msg: "Test ID and active status are required" });
//     }
//     const result = await QuizModel.toggleTestStatusForAll(test_id, active_status);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ msg: "No students assigned to this test" });
//     }
//     return res.status(200).json({ msg: `Test status updated to ${active_status ? 'active' : 'inactive'}` });
//   } catch (error) {
//     console.error("Error in toggleTestStatusForAll:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get assigned students
// const getAssignedStudents = async (req, res) => {
//   try {
//     const students = await QuizModel.getAssignedStudents(req.params.test_id);
//     return res.status(200).json(students);
//   } catch (error) {
//     console.error("Error in getAssignedStudents:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get assigned tests with questions
// const getAssignedTestsWithQuestions = async (req, res) => {
//   try {
//     const { student_id } = req.params;
//     const tests = await QuizModel.getAssignedTestsWithQuestions(student_id);
//     if (tests.length === 0) {
//       return res.status(404).json({ msg: "No assigned tests found for this student" });
//     }
//     return res.status(200).json(tests);
//   } catch (error) {
//     console.error("Error in getAssignedTestsWithQuestions:", error);
//     return res.status(400).json({ msg: error.message || "Failed to fetch assigned tests" });
//   }
// };

// // Submit test (for both assigned and skill-based tests)
// const submitTest = async (req, res) => {
//   try {
//     const {
//       test_id,
//       student_id,
//       answers,
//       easy_score,
//       medium_score,
//       hard_score,
//       total_score,
//       incorrect_answer_count,
//       student_level,
//       percentage,
//     } = req.body;

//     if (
//       !test_id ||
//       !student_id ||
//       !answers ||
//       typeof answers !== "object" ||
//       !student_level ||
//       percentage === undefined
//     ) {
//       return res.status(400).json({ msg: "Test ID, student ID, answers, student level, and percentage are required" });
//     }

//     // Check if test is assigned or skill-based
//     const assignedTests = await QuizModel.getAssignedTestsWithQuestions(student_id);
//     const skillTests = await QuizModel.getSkillBasedTestsWithQuestions(student_id);
//     const test = [...assignedTests, ...skillTests].find((t) => t.test_id === Number(test_id));

//     if (!test) {
//       return res.status(404).json({ msg: "Test not found or not available for this student" });
//     }

//     const maxEasyScore = test.easy_level_question;
//     const maxMediumScore = test.medium_level_question;
//     const maxHardScore = test.hard_level_question;
//     const maxTotalScore = maxEasyScore + maxMediumScore + maxHardScore;

//     if (
//       easy_score > maxEasyScore ||
//       medium_score > maxMediumScore ||
//       hard_score > maxHardScore ||
//       total_score > maxTotalScore
//     ) {
//       return res.status(400).json({ msg: "Submitted scores exceed maximum possible values" });
//     }

//     const totalQuestions = test.total_no_of_questions;
//     const correctEasy = easy_score;
//     const correctMedium = medium_score;
//     const correctHard = hard_score;
//     const correctCount = correctEasy + correctMedium + correctHard;

//     if (incorrect_answer_count > totalQuestions - correctCount || incorrect_answer_count < 0) {
//       return res.status(400).json({ msg: "Incorrect answer count is invalid" });
//     }

//     // Validate student_level
//     let expectedLevel = "Failed";
//     if (easy_score >= test.easy_pass_mark) {
//       expectedLevel = "Easy";
//       if (test.difficulty_level_id >= 2 && medium_score >= test.medium_pass_mark) {
//         expectedLevel = "Medium";
//         if (test.difficulty_level_id === 3 && hard_score >= test.hard_pass_mark) {
//           expectedLevel = "Hard";
//         }
//       }
//     }
//     if (student_level !== expectedLevel) {
//       return res.status(400).json({ msg: "Invalid student level based on scores" });
//     }

//     const resultData = {
//       test_id,
//       student_id,
//       easy_score,
//       medium_score,
//       hard_score,
//       total_score,
//       incorrect_answer_count,
//       student_level,
//       percentage,
//     };

//     const result = await QuizModel.saveTestResult(resultData);
//     return res.status(201).json({ msg: "Test results saved successfully", result_id: result.insertId });
//   } catch (error) {
//     console.error("Error in submitTest:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get questions by skill and difficulty level
// const getQuestionsBySkillAndLevel = async (req, res) => {
//   try {
//     const { skill_id, level_id } = req.params;
//     const { count = 10, exclude } = req.query;
//     const excludeIds = exclude ? exclude.split(",").map(Number) : [];
//     const questions = await QuizModel.getQuestionsBySkillAndLevel(skill_id, level_id, parseInt(count), excludeIds);
//     const parsedQuestions = questions.map((q) => ({
//       ...q,
//       option: JSON.parse(q.option),
//     }));
//     return res.status(200).json(parsedQuestions);
//   } catch (error) {
//     console.error("Error in getQuestionsBySkillAndLevel:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get skill-based tests with questions for a student
// const getSkillBasedTestsWithQuestions = async (req, res) => {
//   try {
//     const { student_id } = req.params;
//     const tests = await QuizModel.getSkillBasedTestsWithQuestions(student_id);
//     if (tests.length === 0) {
//       return res.status(404).json({ msg: "No skill-based tests found for this student" });
//     }
//     return res.status(200).json(tests);
//   } catch (error) {
//     console.error("Error in getSkillBasedTestsWithQuestions:", error);
//     return res.status(400).json({ msg: error.message || "Failed to fetch skill-based tests" });
//   }
// };

// export default {
//   createSkill,
//   getAllSkills,
//   getSkillById,
//   updateSkill,
//   deleteSkill,
//   createLevel,
//   getAllLevels,
//   getLevelById,
//   updateLevel,
//   deleteLevel,
//   createMCQ,
//   getAllMcqs,
//   getMcqById,
//   updateMcq,
//   deleteMcq,
//   getMcqsByStudentSkills,
//   getEntryTestQuestions,
//   submitEntryTest,
//   saveQuizAttempt,
//   getQuizAttempts,
//   createTest,
//   getAvailableQuestions,
//   getAllTests,
//   getAllStudents,
//   assignTest,
//   toggleTestStatusForAll,
//   getAssignedStudents,
//   getAssignedTestsWithQuestions,
//   submitTest,
//   getQuestionsBySkillAndLevel,
//   getSkillBasedTestsWithQuestions,
// };





































import QuizModel from "../models/quizModel.js";

// Create skill
const createSkill = async (req, res) => {
  try {
    const skillData = req.body;
    if (!skillData.skill_name) {
      return res.status(400).json({ msg: "Skill name is required" });
    }
    const result = await QuizModel.createSkill(skillData);
    return res.status(201).json({ msg: "Skill created successfully", skill_id: result.insertId });
  } catch (error) {
    console.error("Error in createSkill:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all skills
const getAllSkills = async (req, res) => {
  try {
    const skills = await QuizModel.getAllSkills();
    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error in getAllSkills:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get skill by ID
const getSkillById = async (req, res) => {
  try {
    const skill = await QuizModel.getSkillById(req.params.skill_id);
    if (!skill) {
      return res.status(404).json({ msg: "Skill not found" });
    }
    return res.status(200).json(skill);
  } catch (error) {
    console.error("Error in getSkillById:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const result = await QuizModel.updateSkill(req.params.skill_id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Skill not found" });
    }
    return res.status(200).json({ msg: "Skill updated successfully" });
  } catch (error) {
    console.error("Error in updateSkill:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const result = await QuizModel.deleteSkill(req.params.skill_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Skill not found" });
    }
    return res.status(200).json({ msg: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSkill:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create difficulty level
const createLevel = async (req, res) => {
  try {
    const levelData = req.body;
    if (!levelData.level_name) {
      return res.status(400).json({ msg: "Level name is required" });
    }
    const result = await QuizModel.createLevel(levelData);
    return res.status(201).json({ msg: "Level created successfully", level_id: result.insertId });
  } catch (error) {
    console.error("Error in createLevel:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all difficulty levels
const getAllLevels = async (req, res) => {
  try {
    const levels = await QuizModel.getAllLevels();
    return res.status(200).json(levels);
  } catch (error) {
    console.error("Error in getAllLevels:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get difficulty level by ID
const getLevelById = async (req, res) => {
  try {
    const level = await QuizModel.getLevelById(req.params.level_id);
    if (!level) {
      return res.status(404).json({ msg: "Level not found" });
    }
    return res.status(200).json(level);
  } catch (error) {
    console.error("Error in getLevelById:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Update difficulty level
const updateLevel = async (req, res) => {
  try {
    const result = await QuizModel.updateLevel(req.params.level_id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Level not found" });
    }
    return res.status(200).json({ msg: "Level updated successfully" });
  } catch (error) {
    console.error("Error in updateLevel:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Delete difficulty level
const deleteLevel = async (req, res) => {
  try {
    const result = await QuizModel.deleteLevel(req.params.level_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Level not found" });
    }
    return res.status(200).json({ msg: "Level deleted successfully" });
  } catch (error) {
    console.error("Error in deleteLevel:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create MCQ
const createMCQ = async (req, res) => {
  try {
    const mcqData = req.body;
    if (!mcqData.questions || !mcqData.option || !mcqData.correct_answer || !mcqData.skill_id || !mcqData.difficulty_level_id) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    mcqData.option = JSON.stringify(mcqData.option);
    const result = await QuizModel.createMCQ(mcqData);
    return res.status(201).json({ msg: "MCQ created successfully", id: result.insertId });
  } catch (error) {
    console.error("Error in createMCQ:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all MCQs
const getAllMcqs = async (req, res) => {
  try {
    const mcqs = await QuizModel.getAllMcqs();
    const parsedMcqs = mcqs.map((mcq) => ({
      ...mcq,
      option: JSON.parse(mcq.option || '[]'),
    }));
    return res.status(200).json(parsedMcqs);
  } catch (error) {
    console.error("Error in getAllMcqs:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get MCQ by ID
const getMcqById = async (req, res) => {
  try {
    const mcq = await QuizModel.getMcqById(req.params.id);
    if (!mcq) {
      return res.status(404).json({ msg: "MCQ not found" });
    }
    mcq.option = JSON.parse(mcq.option || '[]');
    return res.status(200).json(mcq);
  } catch (error) {
    console.error("Error in getMcqById:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Update MCQ
const updateMcq = async (req, res) => {
  try {
    const mcqData = req.body;
    if (mcqData.option) {
      mcqData.option = JSON.stringify(mcqData.option);
    }
    const result = await QuizModel.updateMcq(req.params.id, mcqData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "MCQ not found" });
    }
    return res.status(200).json({ msg: "MCQ updated successfully" });
  } catch (error) {
    console.error("Error in updateMcq:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Delete MCQ
const deleteMcq = async (req, res) => {
  try {
    const result = await QuizModel.deleteMcq(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "MCQ not found" });
    }
    return res.status(200).json({ msg: "MCQ deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMcq:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get MCQs by student skills
const getMcqsByStudentSkills = async (req, res) => {
  try {
    const { student_id } = req.params;
    const mcqs = await QuizModel.getMcqsByStudentSkills(student_id);
    if (mcqs.length === 0) {
      return res.status(404).json({ msg: "No MCQs found for this student's skills" });
    }
    const parsedMcqs = mcqs.map((mcq) => ({
      ...mcq,
      option: JSON.parse(mcq.option || '[]'),
    }));
    return res.status(200).json(parsedMcqs);
  } catch (error) {
    console.error("Error in getMcqsByStudentSkills:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get entry test questions
const getEntryTestQuestions = async (req, res) => {
  try {
    const { student_id } = req.params;
    const questions = await QuizModel.getEntryTestQuestionsByStudentSkills(student_id);
    if (questions.length === 0) {
      return res.status(404).json({ msg: "No questions found for this student's skills" });
    }
    const parsedQuestions = questions.map((q) => ({
      ...q,
      option: JSON.parse(q.option || '[]'),
    }));
    return res.status(200).json(parsedQuestions);
  } catch (error) {
    console.error("Error in getEntryTestQuestions:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Submit entry test
const submitEntryTest = async (req, res) => {
  try {
    const { student_id, answers } = req.body;
    if (!student_id || !answers || typeof answers !== "object") {
      return res.status(400).json({ msg: "Student ID and answers are required" });
    }
    const questions = await QuizModel.getEntryTestQuestionsByStudentSkills(student_id);
    if (questions.length === 0) {
      return res.status(404).json({ msg: "No questions found for this student" });
    }
    let correctCount = 0;
    const totalQuestions = questions.length;
    const answerDetails = {};
    questions.forEach((q) => {
      const submittedAnswer = answers[q.id];
      const isCorrect = submittedAnswer === q.correct_answer;
      if (isCorrect) correctCount += 1;
      answerDetails[q.id] = {
        question: q.questions,
        submitted_answer: submittedAnswer,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
      };
    });
    const percentage = (correctCount / totalQuestions) * 100;
    const resultData = {
      student_id,
      total_questions: totalQuestions,
      correct_answers: correctCount,
      incorrect_answers: totalQuestions - correctCount,
      percentage,
      answer_details: JSON.stringify(answerDetails),
    };
    const result = await QuizModel.saveEntryTestResult(resultData);
    return res.status(201).json({
      msg: "Entry test submitted successfully",
      result_id: result.insertId,
      percentage,
      correctCount,
      totalQuestions,
    });
  } catch (error) {
    console.error("Error in submitEntryTest:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Save quiz attempt
const saveQuizAttempt = async (req, res) => {
  try {
    const attemptData = req.body;
    if (
      !attemptData.student_id ||
      !attemptData.skill_id ||
      !attemptData.difficulty_level_id ||
      !attemptData.questions ||
      !attemptData.correct_answer ||
      !attemptData.selected_option
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    attemptData.questions = JSON.stringify(attemptData.questions);
    attemptData.correct_answer = JSON.stringify(attemptData.correct_answer);
    attemptData.selected_option = JSON.stringify(attemptData.selected_option);
    const result = await QuizModel.createQuizAttempt(attemptData);
    return res.status(201).json({ msg: "Quiz attempt saved successfully", attempt_id: result.insertId });
  } catch (error) {
    console.error("Error in saveQuizAttempt:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get quiz attempts
const getQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizModel.getQuizAttemptsByStudentId(req.params.student_id);
    if (attempts.length === 0) {
      return res.status(404).json({ msg: "No quiz attempts found for this student" });
    }
    const parsedAttempts = attempts.map((attempt) => ({
      ...attempt,
      questions: JSON.parse(attempt.questions || '[]'),
      correct_answer: JSON.parse(attempt.correct_answer || '[]'),
      selected_option: JSON.parse(attempt.selected_option || '[]'),
    }));
    return res.status(200).json(parsedAttempts);
  } catch (error) {
    console.error("Error in getQuizAttempts:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create test
const createTest = async (req, res) => {
  try {
    const testData = req.body;
    if (
      !testData.test_name ||
      !testData.skill_id ||
      !testData.difficulty_level_id ||
      !testData.easy_level_question ||
      !testData.medium_level_question ||
      !testData.hard_level_question ||
      !testData.total_no_of_questions ||
      !testData.easy_pass_mark ||
      !testData.medium_pass_mark ||
      !testData.hard_pass_mark
    ) {
      return res.status(400).json({ msg: "All test fields are required" });
    }
    const availableQuestions = await QuizModel.getAvailableQuestions(
      testData.skill_id,
      testData.difficulty_level_id
    );
    const easyQuestions = availableQuestions.filter((q) => q.difficulty_level_id === 1);
    const mediumQuestions = availableQuestions.filter((q) => q.difficulty_level_id === 2);
    const hardQuestions = availableQuestions.filter((q) => q.difficulty_level_id === 3);
    if (testData.easy_level_question > easyQuestions.length) {
      return res.status(400).json({
        msg: `Not enough easy questions available. Required: ${testData.easy_level_question}, Available: ${easyQuestions.length}`,
      });
    }
    if (testData.difficulty_level_id >= 2 && testData.medium_level_question > mediumQuestions.length) {
      return res.status(400).json({
        msg: `Not enough medium questions available. Required: ${testData.medium_level_question}, Available: ${mediumQuestions.length}`,
      });
    }
    if (testData.difficulty_level_id === 3 && testData.hard_level_question > hardQuestions.length) {
      return res.status(400).json({
        msg: `Not enough hard questions available. Required: ${testData.hard_level_question}, Available: ${hardQuestions.length}`,
      });
    }
    const result = await QuizModel.createTest(testData);
    return res.status(201).json({ msg: "Test created successfully", test_id: result.insertId });
  } catch (error) {
    console.error("Error in createTest:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get available questions
const getAvailableQuestions = async (req, res) => {
  try {
    const { skill_id, level_id } = req.query;
    const questions = await QuizModel.getAvailableQuestions(skill_id, level_id);
    const parsedQuestions = questions.map((q) => ({
      ...q,
      option: JSON.parse(q.option || '[]'),
    }));
    return res.status(200).json(parsedQuestions);
  } catch (error) {
    console.error("Error in getAvailableQuestions:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all tests
const getAllTests = async (req, res) => {
  try {
    const tests = await QuizModel.getAllTests();
    return res.status(200).json(tests);
  } catch (error) {
    console.error("Error in getAllTests:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await QuizModel.getAllStudents();
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Assign test
const assignTest = async (req, res) => {
  try {
    const { test_id, student_ids, active_status = 0 } = req.body;
    if (!test_id || !student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
      return res.status(400).json({ msg: "Test ID and student IDs are required" });
    }
    const assignmentData = student_ids.map((student_id) => ({ test_id, student_id, active_status }));
    const result = await QuizModel.assignTest(assignmentData);
    return res.status(201).json({ msg: "Test assigned successfully", affectedRows: result.affectedRows });
  } catch (error) {
    console.error("Error in assignTest:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Toggle test status for all students
const toggleTestStatusForAll = async (req, res) => {
  try {
    const { test_id, active_status } = req.body;
    if (!test_id || active_status === undefined) {
      return res.status(400).json({ msg: "Test ID and active status are required" });
    }
    const result = await QuizModel.toggleTestStatusForAll(test_id, active_status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "No students assigned to this test" });
    }
    return res.status(200).json({ msg: `Test status updated to ${active_status ? 'active' : 'inactive'}` });
  } catch (error) {
    console.error("Error in toggleTestStatusForAll:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get assigned students
const getAssignedStudents = async (req, res) => {
  try {
    const students = await QuizModel.getAssignedStudents(req.params.test_id);
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error in getAssignedStudents:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all tests with questions for a student (assigned and skill-based)
const getAllTestsWithQuestions = async (req, res) => {
  try {
    const { student_id } = req.params;
    const tests = await QuizModel.getAllTestsWithQuestions(student_id);
    if (tests.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404 to allow UI to handle gracefully
    }
    return res.status(200).json(tests);
  } catch (error) {
    console.error("Error in getAllTestsWithQuestions:", error);
    return res.status(400).json({ msg: error.message || "Failed to fetch tests" });
  }
};

// Submit test (for both assigned and skill-based tests)
const submitTest = async (req, res) => {
  try {
    const {
      test_id,
      student_id,
      answers,
      easy_score,
      medium_score,
      hard_score,
      total_score,
      incorrect_answer_count,
      student_level,
      percentage,
    } = req.body;

    if (
      !test_id ||
      !student_id ||
      !answers ||
      typeof answers !== "object" ||
      !student_level ||
      percentage === undefined
    ) {
      return res.status(400).json({ msg: "Test ID, student ID, answers, student level, and percentage are required" });
    }

    // Check if test is available for the student
    const tests = await QuizModel.getAllTestsWithQuestions(student_id);
    const test = tests.find((t) => t.test_id === Number(test_id));

    if (!test) {
      return res.status(404).json({ msg: "Test not found or not available for this student" });
    }

    const maxEasyScore = test.easy_level_question;
    const maxMediumScore = test.medium_level_question;
    const maxHardScore = test.hard_level_question;
    const maxTotalScore = maxEasyScore + maxMediumScore + maxHardScore;

    if (
      easy_score > maxEasyScore ||
      medium_score > maxMediumScore ||
      hard_score > maxHardScore ||
      total_score > maxTotalScore
    ) {
      return res.status(400).json({ msg: "Submitted scores exceed maximum possible values" });
    }

    const totalQuestions = test.total_no_of_questions;
    const correctEasy = easy_score;
    const correctMedium = medium_score;
    const correctHard = hard_score;
    const correctCount = correctEasy + correctMedium + correctHard;

    if (incorrect_answer_count > totalQuestions - correctCount || incorrect_answer_count < 0) {
      return res.status(400).json({ msg: "Incorrect answer count is invalid" });
    }

    // Validate student_level
    let expectedLevel = "Failed";
    if (easy_score >= test.easy_pass_mark) {
      expectedLevel = "Easy";
      if (test.difficulty_level_id >= 2 && medium_score >= test.medium_pass_mark) {
        expectedLevel = "Medium";
        if (test.difficulty_level_id === 3 && hard_score >= test.hard_pass_mark) {
          expectedLevel = "Hard";
        }
      }
    }
    if (student_level !== expectedLevel) {
      return res.status(400).json({ msg: "Invalid student level based on scores" });
    }

    const resultData = {
      test_id,
      student_id,
      easy_score,
      medium_score,
      hard_score,
      total_score,
      incorrect_answer_count,
      student_level,
      percentage,
    };

    const result = await QuizModel.saveTestResult(resultData);
    return res.status(201).json({ msg: "Test results saved successfully", result_id: result.insertId });
  } catch (error) {
    console.error("Error in submitTest:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get questions by skill and difficulty level
const getQuestionsBySkillAndLevel = async (req, res) => {
  try {
    const { skill_id, level_id } = req.params;
    const { count = 10, exclude } = req.query;
    const excludeIds = exclude ? exclude.split(",").map(Number) : [];
    const questions = await QuizModel.getQuestionsBySkillAndLevel(skill_id, level_id, parseInt(count), excludeIds);
    const parsedQuestions = questions.map((q) => ({
      ...q,
      option: JSON.parse(q.option || '[]'),
    }));
    return res.status(200).json(parsedQuestions);
  } catch (error) {
    console.error("Error in getQuestionsBySkillAndLevel:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};



// Save a test schedule for a student
const saveTestSchedule = async (req, res) => {
  try {
    const { student_id, test_id, datetime } = req.body;
    if (!student_id || !test_id || !datetime) {
      return res.status(400).json({ msg: "Student ID, test ID, and datetime are required" });
    }
    const result = await QuizModel.saveTestSchedule(student_id, test_id, datetime);
    return res.status(200).json({ msg: "Test schedule saved successfully", schedule_id: result.insertId });
  } catch (error) {
    console.error("Error in saveTestSchedule:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get test schedules for a student
const getTestSchedules = async (req, res) => {
  try {
    const student_id = req.params.student_id;
    const schedules = await QuizModel.getTestSchedules(student_id);
    return res.status(200).json(schedules);
  } catch (error) {
    console.error("Error in getTestSchedules:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};


export default {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  createLevel,
  getAllLevels,
  getLevelById,
  updateLevel,
  deleteLevel,
  createMCQ,
  getAllMcqs,
  getMcqById,
  updateMcq,
  deleteMcq,
  getMcqsByStudentSkills,
  getEntryTestQuestions,
  submitEntryTest,
  saveQuizAttempt,
  getQuizAttempts,
  createTest,
  getAvailableQuestions,
  getAllTests,
  getAllStudents,
  assignTest,
  toggleTestStatusForAll,
  getAssignedStudents,
  getAllTestsWithQuestions,
  submitTest,
  getQuestionsBySkillAndLevel,
 saveTestSchedule,
  getTestSchedules,
  
};