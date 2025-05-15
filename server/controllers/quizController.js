import QuizModel from "../models/quizModel.js";

// Create single or multiple skills
const createSkill = async (req, res) => {
  try {
    const { skill_name } = req.body;

    if (!skill_name || (Array.isArray(skill_name) && skill_name.length === 0)) {
      return res.status(400).json({ msg: "Skill name(s) required" });
    }

    if (typeof skill_name === "string") {
      const result = await QuizModel.createSkill(skill_name);
      return res.status(201).json({ msg: "Skill created successfully", skill_id: result.insertId });
    }

    if (Array.isArray(skill_name)) {
      const result = await QuizModel.createMultipleSkills(skill_name);
      return res.status(201).json({ msg: "Multiple skills created successfully", inserted_count: result.affectedRows });
    }

    return res.status(400).json({ msg: "Invalid skill_name format" });
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
    const { skill_id } = req.params;
    const result = await QuizModel.getSkillById(skill_id);

    if (result.length === 0) {
      return res.status(404).json({ msg: "Skill not found" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error in getSkillById:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const { skill_id } = req.params;
    const { skill_name } = req.body;

    if (!skill_name) {
      return res.status(400).json({ msg: "Skill name is required" });
    }

    const updated = await QuizModel.updateSkill(skill_id, skill_name);
    if (!updated) {
      return res.status(404).json({ msg: "Skill not found" });
    }

    return res.status(200).json({ msg: "Skill updated successfully", skill: updated });
  } catch (error) {
    console.error("Error in updateSkill:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const { skill_id } = req.params;
    const result = await QuizModel.deleteSkill(skill_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Skill not found" });
    }

    return res.status(200).json({ msg: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSkill:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create single or multiple difficulty levels
const createLevel = async (req, res) => {
  try {
    const { level_name } = req.body;

    if (!level_name) {
      return res.status(400).json({ msg: "Level name is required" });
    }

    if (Array.isArray(level_name)) {
      const result = await QuizModel.createMultipleLevels(level_name);
      return res.status(201).json({ msg: "Multiple levels created successfully", inserted_count: result.inserted_count });
    } else {
      const result = await QuizModel.createLevel(level_name);
      return res.status(201).json({ msg: "Level created successfully", level_id: result.level_id });
    }
  } catch (error) {
    console.error("Error creating level:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all difficulty levels
const getAllLevels = async (req, res) => {
  try {
    const levels = await QuizModel.getAllLevels();
    return res.status(200).json(levels);
  } catch (error) {
    console.error("Error fetching levels:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get difficulty level by ID
const getLevelById = async (req, res) => {
  try {
    const { level_id } = req.params;
    const level = await QuizModel.getLevelById(level_id);
    if (!level) {
      return res.status(404).json({ msg: "Level not found" });
    }
    return res.status(200).json(level);
  } catch (error) {
    console.error("Error fetching level:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Update difficulty level
const updateLevel = async (req, res) => {
  try {
    const { level_id } = req.params;
    const { level_name } = req.body;

    if (!level_name) {
      return res.status(400).json({ msg: "Level name is required" });
    }

    const updated = await QuizModel.updateLevel(level_id, level_name);
    if (!updated) {
      return res.status(404).json({ msg: "Level not found" });
    }

    return res.status(200).json({ msg: "Level updated successfully", level: updated });
  } catch (error) {
    console.error("Error updating level:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Delete difficulty level
const deleteLevel = async (req, res) => {
  try {
    const { level_id } = req.params;
    const deleted = await QuizModel.deleteLevel(level_id);

    if (deleted === 0) {
      return res.status(404).json({ msg: "Level not found" });
    }

    return res.status(200).json({ msg: "Level deleted successfully" });
  } catch (error) {
    console.error("Error deleting level:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create single or multiple MCQs
const createMCQ = async (req, res) => {
  const { mcqs } = req.body;

  try {
    if (Array.isArray(mcqs)) {
      const insertResults = [];

      for (const mcq of mcqs) {
        const { skill_id, difficulty_level_id, questions, option, correct_answer } = mcq;

        if (!skill_id || !difficulty_level_id || !questions || !option || !correct_answer) {
          return res.status(400).json({ msg: "All fields are required for each MCQ" });
        }

        const result = await QuizModel.createMCQ(skill_id, difficulty_level_id, questions, option, correct_answer);
        insertResults.push(result);
      }

      return res.status(201).json({ namespace: {
  "prefix": "xs",
  "uri": "http://www.w3.org/2001/XMLSchema"
},
  "msg": "MCQs created successfully",
  "createdMCQs": insertResults
});
    } else if (typeof mcqs === "object") {
      const { skill_id, difficulty_level_id, questions, option, correct_answer } = mcqs;

      if (!skill_id || !difficulty_level_id || !questions || !option || !correct_answer) {
        return res.status(400).json({ msg: "All fields are required for the MCQ" });
      }

      const result = await QuizModel.createMCQ(skill_id, difficulty_level_id, questions, option, correct_answer);
      return res.status(201).json({ msg: "MCQ created successfully", createdMCQ: result });
    } else {
      return res.status(400).json({ msg: "Invalid input format" });
    }
  } catch (error) {
    console.error("Error creating MCQs:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all MCQs
const getAllMcqs = async (req, res) => {
  try {
    const mcqs = await QuizModel.getAllMcqs();
    return res.status(200).json(mcqs);
  } catch (error) {
    console.error("Error fetching MCQs:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get MCQ by ID
const getMcqById = async (req, res) => {
  try {
    const { id } = req.params;
    const mcq = await QuizModel.getMcqById(id);
    if (!mcq) {
      return res.status(404).json({ msg: "MCQ not found" });
    }
    return res.status(200).json(mcq);
  } catch (error) {
    console.error("Error fetching MCQ:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Update MCQ
const updateMcq = async (req, res) => {
  try {
    const { id } = req.params;
    const { skill_id, difficulty_level_id, questions, option, correct_answer } = req.body;

    if (!skill_id || !difficulty_level_id || !questions || !option || !correct_answer) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const updated = await QuizModel.updateMcq(id, req.body);
    if (!updated) {
      return res.status(404).json({ msg: "MCQ not found" });
    }
    return res.status(200).json({ msg: "MCQ updated successfully", mcq: updated });
  } catch (error) {
    console.error("Error updating MCQ:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Delete MCQ
const deleteMcq = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await QuizModel.deleteMcq(id);
    if (deleted === 0) {
      return res.status(404).json({ msg: "MCQ not found" });
    }
    return res.status(200).json({ msg: "MCQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting MCQ:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get MCQs by Student Skills
const getMcqsByStudentSkills = async (req, res) => {
  try {
    const { student_id } = req.params;

    const mcqs = await QuizModel.getMcqsByStudentSkills(student_id);
    if (mcqs.length === 0) {
      return res.status(404).json({ msg: "No MCQs found for this student's skills" });
    }

    return res.status(200).json(mcqs);
  } catch (error) {
    console.error("Error in getMcqsByStudentSkills:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get Entry Test Questions by Student Skills
const getEntryTestQuestions = async (req, res) => {
  try {
    const { student_id } = req.params;

    const questions = await QuizModel.getEntryTestQuestionsByStudentSkills(student_id);
    if (questions.length === 0) {
      return res.status(404).json({ msg: "No questions found for this student's skills" });
    }

    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error in getEntryTestQuestions:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Submit Entry Test
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
    questions.forEach((question) => {
      const selectedAnswer = answers[question.id];
      if (selectedAnswer && selectedAnswer === question.correct_answer) {
        correctCount++;
      }
    });

    const result = await QuizModel.saveEntryTestResult(student_id, correctCount);
    return res.status(201).json({
      msg: "Entry test submitted successfully",
      score: correctCount,
      total: questions.length,
      attempt_id: result.insertId,
    });
  } catch (error) {
    console.error("Error in submitEntryTest:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Save a quiz attempt
const saveQuizAttempt = async (req, res) => {
  try {
    const { student_id, quiz_score } = req.body;

    if (!student_id || quiz_score === undefined) {
      return res.status(400).json({ msg: "Student ID and quiz score are required" });
    }

    const result = await QuizModel.createQuizAttempt(student_id, quiz_score);
    return res.status(201).json({ msg: "Quiz attempt saved successfully", attempt_id: result.insertId });
  } catch (error) {
    console.error("Error in saveQuizAttempt:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get quiz attempts by student ID
const getQuizAttempts = async (req, res) => {
  try {
    const { student_id } = req.params;

    const attempts = await QuizModel.getQuizAttemptsByStudentId(student_id);
    if (attempts.length === 0) {
      return res.status(404).json({ msg: "No quiz attempts found for this student" });
    }

    return res.status(200).json(attempts);
  } catch (error) {
    console.error("Error in getQuizAttempts:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create a test
const createTest = async (req, res) => {
  try {
    const {
      test_name,
      test_description,
      skill_id,
      difficulty_level_id,
      easy_level_question,
      medium_level_question,
      hard_level_question,
      total_no_of_questions,
      easy_pass_mark,
      medium_pass_mark,
      hard_pass_mark,
    } = req.body;

    if (!test_name || !test_description || !skill_id || !difficulty_level_id || !total_no_of_questions) {
      return res.status(400).json({ msg: "All required fields must be provided" });
    }

    if (total_no_of_questions !== easy_level_question + medium_level_question + hard_level_question) {
      return res.status(400).json({ msg: "Total questions must equal sum of level questions" });
    }

    if (
      easy_pass_mark > easy_level_question ||
      medium_pass_mark > medium_level_question ||
      hard_pass_mark > hard_level_question
    ) {
      return res.status(400).json({ msg: "Pass marks cannot exceed the number of questions" });
    }

    const availableQuestions = await QuizModel.getAvailableQuestions();
    const skillQuestions = availableQuestions.find((q) => q.skill_id === Number(skill_id));
    if (!skillQuestions) {
      return res.status(400).json({ msg: "No questions available for the selected skill" });
    }

    const easyShortage = easy_level_question - skillQuestions.easy_count;
    const mediumShortage = medium_level_question - skillQuestions.medium_count;
    const hardShortage = hard_level_question - skillQuestions.hard_count;

    if (easyShortage > 0 || mediumShortage > 0 || hardShortage > 0) {
      const errors = [];
      if (easyShortage > 0) {
        errors.push(`Please add ${easyShortage} more Easy questions. Only ${skillQuestions.easy_count} available.`);
      }
      if (mediumShortage > 0) {
        errors.push(`Please add ${mediumShortage} more Medium questions. Only ${skillQuestions.medium_count} available.`);
      }
      if (hardShortage > 0) {
        errors.push(`Please add ${hardShortage} more Hard questions. Only ${skillQuestions.hard_count} available.`);
      }
      return res.status(400).json({
        msg: "Requested question counts exceed available questions",
        errors,
        available: {
          easy: skillQuestions.easy_count,
          medium: skillQuestions.medium_count,
          hard: skillQuestions.hard_count,
        },
      });
    }

    const testData = {
      test_name,
      test_description,
      skill_id,
      difficulty_level_id,
      easy_level_question,
      medium_level_question,
      hard_level_question,
      total_no_of_questions,
      easy_pass_mark,
      medium_pass_mark,
      hard_pass_mark,
    };

    const result = await QuizModel.createTest(testData);
    return res.status(201).json({ msg: "Test created successfully", test_id: result.insertId });
  } catch (error) {
    console.error("Error in createTest:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get available question counts by skill and difficulty level
const getAvailableQuestions = async (req, res) => {
  try {
    const questionCounts = await QuizModel.getAvailableQuestions();
    return res.status(200).json(questionCounts);
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

// Assign a test to a student
const assignTest = async (req, res) => {
  try {
    const { test_id, student_id } = req.body;
    if (!test_id || !student_id) {
      return res.status(400).json({ msg: "Test ID and Student ID are required" });
    }
    await QuizModel.assignTest(test_id, student_id);
    return res.status(200).json({ msg: "Test assigned successfully" });
  } catch (error) {
    console.error("Error in assignTest:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get assigned students for a test
const getAssignedStudents = async (req, res) => {
  try {
    const { test_id } = req.params;
    const students = await QuizModel.getAssignedStudents(test_id);
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error in getAssignedStudents:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get assigned tests with questions for a student
const getAssignedTestsWithQuestions = async (req, res) => {
  try {
    const { student_id } = req.params;
    const tests = await QuizModel.getAssignedTestsWithQuestions(student_id);
    if (tests.length === 0) {
      return res.status(404).json({ msg: "No assigned tests found for this student" });
    }
    return res.status(200).json(tests);
  } catch (error) {
    console.error("Error in getAssignedTestsWithQuestions:", error);
    return res.status(400).json({ msg: error.message || "Failed to fetch assigned tests" });
  }
};

// Submit test and save results
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

    const tests = await QuizModel.getAssignedTestsWithQuestions(student_id);
    const test = tests.find((t) => t.test_id === Number(test_id));
    if (!test) {
      return res.status(404).json({ msg: "Test not found or not assigned to this student" });
    }

    const maxEasyScore = test.easy_level_question;
    const maxMediumScore = test.medium_level_question * 2;
    const maxHardScore = test.hard_level_question * 3;
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
    const correctEasy = easy_score; // 1 point per correct easy question
    const correctMedium = medium_score / 2; // 2 points per correct medium question
    const correctHard = hard_score / 3; // 3 points per correct hard question
    const correctCount = correctEasy + correctMedium + correctHard;

    if (incorrect_answer_count > totalQuestions - correctCount || incorrect_answer_count < 0) {
      return res.status(400).json({ msg: "Incorrect answer count is invalid" });
    }

    // Validate student_level
    let expectedLevel = "Failed";
    if (easy_score >= test.easy_pass_mark) {
      expectedLevel = "Easy";
      if (test.difficulty_level_id >= 2 && medium_score >= test.medium_pass_mark * 2) {
        expectedLevel = "Medium";
        if (test.difficulty_level_id === 3 && hard_score >= test.hard_pass_mark * 3) {
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

// Get questions for a specific skill and difficulty level, excluding asked questions
const getQuestionsBySkillAndLevel = async (req, res) => {
  try {
    const { skill_id, level_id } = req.params;
    const { count, exclude } = req.query;
    const excludeIds = exclude ? exclude.split(",").map(Number) : [];
    const questionCount = parseInt(count) || 1;
    const questions = await QuizModel.getQuestionsBySkillAndLevel(skill_id, level_id, excludeIds, questionCount);
    if (questions.length < questionCount) {
      return res.status(400).json({
        msg: `Please add ${questionCount - questions.length} more questions for skill ${skill_id} and level ${level_id}. Only ${questions.length} available.`,
      });
    }
    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error in getQuestionsBySkillAndLevel:", error);
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
  getAssignedStudents,
  getAssignedTestsWithQuestions,
  submitTest,
  getQuestionsBySkillAndLevel,
};