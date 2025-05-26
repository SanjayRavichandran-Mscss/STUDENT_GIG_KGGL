import TestModel from "../models/testmodel.js";

// Create skill
const createSkill = async (req, res) => {
  try {
    const skillData = req.body;
    if (!skillData.skill_name) {
      return res.status(400).json({ msg: "Skill name is required" });
    }
    const result = await TestModel.createSkill(skillData);
    return res.status(201).json({ msg: "Skill created successfully", skill_id: result.insertId });
  } catch (error) {
    console.error("Error in createSkill:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all skills
const getAllSkills = async (req, res) => {
  try {
    const skills = await TestModel.getAllSkills();
    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error in getAllSkills:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get active skills
const getActiveSkills = async (req, res) => {
  try {
    const activeSkills = await TestModel.getActiveSkills();
    return res.status(200).json(activeSkills);
  } catch (error) {
    console.error("Error in getActiveSkills:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get skill by ID
const getSkillById = async (req, res) => {
  try {
    const skill = await TestModel.getSkillById(req.params.skill_id);
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
    const result = await TestModel.updateSkill(req.params.skill_id, req.body);
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
    const result = await TestModel.deleteSkill(req.params.skill_id);
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
    const result = await TestModel.createLevel(levelData);
    return res.status(201).json({ msg: "Level created successfully", level_id: result.insertId });
  } catch (error) {
    console.error("Error in createLevel:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all difficulty levels
const getAllLevels = async (req, res) => {
  try {
    const levels = await TestModel.getAllLevels();
    return res.status(200).json(levels);
  } catch (error) {
    console.error("Error in getAllLevels:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get difficulty level by ID
const getLevelById = async (req, res) => {
  try {
    const level = await TestModel.getLevelById(req.params.level_id);
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
    const result = await TestModel.updateLevel(req.params.level_id, req.body);
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
    const result = await TestModel.deleteLevel(req.params.level_id);
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
    if (
      !mcqData.questions ||
      !mcqData.option ||
      !mcqData.correct_answer ||
      !mcqData.skill_id ||
      !mcqData.difficulty_level_id ||
      !mcqData.question_status
    ) {
      return res.status(400).json({ msg: "All fields are required, including question_status" });
    }
    mcqData.option = JSON.stringify(mcqData.option);
    const result = await TestModel.createMCQ(mcqData);
    return res.status(201).json({ msg: "MCQ created successfully", id: result.insertId });
  } catch (error) {
    console.error("Error in createMCQ:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all MCQs
const getAllMcqs = async (req, res) => {
  try {
    const mcqs = await TestModel.getAllMcqs();
    const parsedMcqs = mcqs.map((mcq) => {
      let parsedOption = [];
      try {
        if (Array.isArray(mcq.option)) {
          parsedOption = mcq.option;
        } else if (typeof mcq.option === "string" && mcq.option.trim() !== "") {
          parsedOption = JSON.parse(mcq.option);
          if (!Array.isArray(parsedOption)) {
            throw new Error(`Invalid option format for MCQ ID ${mcq.id}`);
          }
        }
      } catch (error) {
        console.error(`Error parsing option for MCQ ID ${mcq.id}:`, error.message);
        parsedOption = [];
      }
      return {
        ...mcq,
        option: parsedOption,
      };
    });
    return res.status(200).json(parsedMcqs);
  } catch (error) {
    console.error("Error in getAllMcqs:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get MCQ by ID
const getMcqById = async (req, res) => {
  try {
    const mcq = await TestModel.getMcqById(req.params.id);
    if (!mcq) {
      return res.status(404).json({ msg: "MCQ not found" });
    }
    let parsedOption = [];
    try {
      if (Array.isArray(mcq.option)) {
        parsedOption = mcq.option;
      } else if (typeof mcq.option === "string" && mcq.option.trim() !== "") {
        parsedOption = JSON.parse(mcq.option);
        if (!Array.isArray(parsedOption)) {
          throw new Error(`Invalid option format for MCQ ID ${mcq.id}`);
        }
      }
    } catch (error) {
      console.error(`Error parsing option for MCQ ID ${mcq.id}:`, error.message);
      parsedOption = [];
    }
    return res.status(200).json({ ...mcq, option: parsedOption });
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
    const result = await TestModel.updateMcq(req.params.id, mcqData);
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
    const result = await TestModel.deleteMcq(req.params.id);
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
    const mcqs = await TestModel.getMcqsByStudentSkills(student_id);
    if (mcqs.length === 0) {
      return res.status(404).json({ msg: "No MCQs found for this student's skills" });
    }
    const parsedMcqs = mcqs.map((mcq) => {
      let parsedOption = [];
      try {
        if (Array.isArray(mcq.option)) {
          parsedOption = mcq.option;
        } else if (typeof mcq.option === "string" && mcq.option.trim() !== "") {
          parsedOption = JSON.parse(mcq.option);
          if (!Array.isArray(parsedOption)) {
            throw new Error(`Invalid option format for MCQ ID ${mcq.id}`);
          }
        }
      } catch (error) {
        console.error(`Error parsing option for MCQ ID ${mcq.id}:`, error.message);
        parsedOption = [];
      }
      return {
        ...mcq,
        option: parsedOption,
      };
    });
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
    const questions = await TestModel.getEntryTestQuestionsByStudentSkills(student_id);
    if (questions.length === 0) {
      return res.status(404).json({ msg: "No questions found for this student's skills" });
    }
    const parsedQuestions = questions.map((q) => {
      let parsedOption = [];
      try {
        if (Array.isArray(q.option)) {
          parsedOption = q.option;
        } else if (typeof q.option === "string" && q.option.trim() !== "") {
          parsedOption = JSON.parse(q.option);
          if (!Array.isArray(parsedOption)) {
            throw new Error(`Invalid option format for question ID ${q.id}`);
          }
        }
      } catch (error) {
        console.error(`Error parsing option for question ID ${q.id}:`, error.message);
        parsedOption = [];
      }
      return {
        ...q,
        option: parsedOption,
      };
    });
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
    const questions = await TestModel.getEntryTestQuestionsByStudentSkills(student_id);
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
    const result = await TestModel.saveEntryTestResult(resultData);
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
    const result = await TestModel.createQuizAttempt(attemptData);
    return res.status(201).json({ msg: "Quiz attempt saved successfully", attempt_id: result.insertId });
  } catch (error) {
    console.error("Error in saveQuizAttempt:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get quiz attempts
const getQuizAttempts = async (req, res) => {
  try {
    const attempts = await TestModel.getQuizAttemptsByStudentId(req.params.student_id);
    if (attempts.length === 0) {
      return res.status(404).json({ msg: "No quiz attempts found for this student" });
    }
    const parsedAttempts = attempts.map((attempt) => {
      let parsedQuestions = [];
      let parsedCorrectAnswer = [];
      let parsedSelectedOption = [];
      try {
        parsedQuestions = JSON.parse(attempt.questions || '[]');
        parsedCorrectAnswer = JSON.parse(attempt.correct_answer || '[]');
        parsedSelectedOption = JSON.parse(attempt.selected_option || '[]');
      } catch (error) {
        console.error(`Error parsing quiz attempt ID ${attempt.id}:`, error.message);
      }
      return {
        ...attempt,
        questions: parsedQuestions,
        correct_answer: parsedCorrectAnswer,
        selected_option: parsedSelectedOption,
      };
    });
    return res.status(200).json(parsedAttempts);
  } catch (error) {
    console.error("Error in getQuizAttempts:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create test
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
      duration_minutes,
    } = req.body;

    // Validate required fields
    if (!test_name || !test_description || !skill_id || !difficulty_level_id || !total_no_of_questions || !duration_minutes) {
      return res.status(400).json({ msg: "All required fields must be provided, including test duration" });
    }

    // Validate pass marks
    if (
      easy_pass_mark > easy_level_question ||
      medium_pass_mark > medium_level_question ||
      hard_pass_mark > hard_level_question
    ) {
      return res.status(400).json({ msg: "Pass marks cannot exceed the number of questions" });
    }

    // Check available questions
    const availableQuestions = await TestModel.getAvailableQuestions();
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

    // Prepare test data
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
      duration_minutes,
    };

    const result = await TestModel.createTest(testData);
    return res.status(201).json({ msg: "Test created successfully", test_id: result.insertId });
  } catch (error) {
    console.error("Error in createTest:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get available question counts by skill and difficulty level
const getAvailableQuestions = async (req, res) => {
  try {
    const questionCounts = await TestModel.getAvailableQuestions();
    return res.status(200).json(questionCounts);
  } catch (error) {
    console.error("Error in getAvailableQuestions:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all tests
const getAllTests = async (req, res) => {
  try {
    const tests = await TestModel.getAllTests();
    return res.status(200).json(tests);
  } catch (error) {
    console.error("Error in getAllTests:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await TestModel.getAllStudents();
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
    const result = await TestModel.assignTest(assignmentData);
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
    const status = active_status ? 1 : 0;
    const result = await TestModel.toggleTestStatusForAll(test_id, status);
    if (result.testAssignedAffected === 0 && result.skillTestsAffected === 0) {
      return res.status(404).json({ msg: "No tests found with this test ID" });
    }
    return res.status(200).json({
      msg: `Test status updated to ${status ? 'active' : 'inactive'}`,
      testAssignedAffected: result.testAssignedAffected,
      skillTestsAffected: result.skillTestsAffected,
    });
  } catch (error) {
    console.error("Error in toggleTestStatusForAll:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get assigned students
const getAssignedStudents = async (req, res) => {
  try {
    const students = await TestModel.getAssignedStudents(req.params.test_id);
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
    const tests = await TestModel.getAllTestsWithQuestions(student_id);
    if (tests.length === 0) {
      return res.status(200).json([]);
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
      attempt_id,
    } = req.body;
    if (
      !test_id ||
      !student_id ||
      !answers ||
      typeof answers !== "object" ||
      !student_level ||
      percentage === undefined ||
      !attempt_id
    ) {
      return res.status(400).json({ msg: "Test ID, student ID, answers, student level, percentage, and attempt ID are required" });
    }
    await TestModel.completeTestAttempt(attempt_id);
    const tests = await TestModel.getAllTestsWithQuestions(student_id);
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
    const result = await TestModel.saveTestResult(resultData);
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
    const questions = await TestModel.getQuestionsBySkillAndLevel(skill_id, level_id, parseInt(count), excludeIds);
    const parsedQuestions = questions.map((q) => {
      let parsedOption = [];
      try {
        if (Array.isArray(q.option)) {
          parsedOption = q.option;
        } else if (typeof q.option === "string" && q.option.trim() !== "") {
          parsedOption = JSON.parse(q.option);
          if (!Array.isArray(parsedOption)) {
            throw new Error(`Invalid option format for question ID ${q.id}`);
          }
        }
      } catch (error) {
        console.error(`Error parsing option for question ID ${q.id}:`, error.message);
        parsedOption = [];
      }
      return {
        ...q,
        option: parsedOption,
      };
    });
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
    const result = await TestModel.saveTestSchedule(student_id, test_id, datetime);
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
    const schedules = await TestModel.getTestSchedules(student_id);
    return res.status(200).json(schedules);
  } catch (error) {
    console.error("Error in getTestSchedules:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create bulk MCQs
const createBulkMcq = async (req, res) => {
  try {
    const mcqs = req.body;
    if (!Array.isArray(mcqs) || mcqs.length === 0) {
      return res.status(400).json({ msg: "An array of MCQs is required" });
    }
    const insertedIds = [];
    for (const mcq of mcqs) {
      if (
        !mcq.questions ||
        !mcq.option ||
        !Array.isArray(mcq.option) ||
        mcq.option.length < 4 ||
        !mcq.correct_answer ||
        !mcq.skill_id ||
        !mcq.difficulty_level_id ||
        !mcq.question_status
      ) {
        return res.status(400).json({ 
          msg: `Invalid MCQ: ${JSON.stringify(mcq)}. All fields (questions, option, correct_answer, skill_id, difficulty_level_id, question_status) are required.` 
        });
      }
      for (const opt of mcq.option) {
        if (!opt.option || !opt.feedback) {
          return res.status(400).json({ 
            msg: `Invalid option in MCQ: ${JSON.stringify(mcq)}. Each option must have option text and feedback.` 
          });
        }
      }
      if (!mcq.option.some((opt) => opt.option === mcq.correct_answer)) {
        return res.status(400).json({ 
          msg: `Correct answer "${mcq.correct_answer}" in MCQ does not match any option.` 
        });
      }
      const mcqData = {
        ...mcq,
        option: JSON.stringify(mcq.option),
      };
      const result = await TestModel.createMCQ(mcqData);
      insertedIds.push(result.insertId);
    }
    return res.status(201).json({
      msg: `Successfully created ${insertedIds.length} MCQ(s)`,
      ids: insertedIds,
    });
  } catch (error) {
    console.error("Error in createBulkMcq:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get student test results
const studentTestAttended = async (req, res) => {
  try {
    const { student_id } = req.params;
    if (!student_id) {
      return res.status(400).json({ msg: "Student ID is required" });
    }
    const results = await TestModel.getStudentTestResults(student_id);
    const attendedTestIds = results.map((result) => result.test_id);
    return res.status(200).json({
      student_id,
      attended_tests: attendedTestIds,
    });
  } catch (error) {
    console.error("Error in studentTestAttended:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Start a test attempt
const startTest = async (req, res) => {
  try {
    const { student_id, test_id, test_type } = req.body;
    if (!student_id || !test_id || !test_type) {
      return res.status(400).json({ msg: "Student ID, test ID, and test type are required" });
    }
    const result = await TestModel.startTest(student_id, test_id, test_type);
    return res.status(200).json({
      attempt_id: result.attempt_id,
      time_left_seconds: result.time_left_seconds,
      start_time: result.start_time.toISOString(),
    });
  } catch (error) {
    console.error("Error in startTest:", error);
    return res.status(500).json({ msg: error.message || "Server error" });
  }
};

// Get remaining time for a test attempt
const getTestTime = async (req, res) => {
  try {
    const { attempt_id } = req.params;
    if (!attempt_id) {
      return res.status(400).json({ msg: "Attempt ID is required" });
    }
    const timeLeftSeconds = await TestModel.getTestTime(attempt_id);
    return res.status(200).json({ time_left_seconds: timeLeftSeconds });
  } catch (error) {
    console.error("Error in getTestTime:", error);
    return res.status(500).json({ msg: error.message || "Server error" });
  }
};

// Get transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await TestModel.getAllTransactions();
    res.status(200).json({
      status: true,
      message: "Transactions fetched successfully",
      result: transactions,
    });
  } catch (error) {
    console.error("Error in getTransactions:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

// Check payment status for a student's project
const checkPaymentStatus = async (req, res) => {
  try {
    const { student_id, project_id } = req.params;
    if (!student_id || !project_id) {
      return res.status(400).json({ msg: "Student ID and Project ID are required" });
    }
    const payment = await TestModel.checkPaymentStatus(student_id, project_id);
    if (!payment) {
      return res.status(200).json({ status: false, payment: null, msg: "No payment details found" });
    }
    return res.status(200).json({
      status: true,
      payment,
      msg: "Payment details found",
    });
  } catch (error) {
    console.error("Error in checkPaymentStatus:", error);
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
  getActiveSkills,
  createBulkMcq,
  studentTestAttended,
  startTest,
  getTestTime,
  getTransactions,
  checkPaymentStatus,
};