import db from "../config/db.js";

// Create skill
const createSkill = async (req, res) => {
  try {
    const skillData = req.body;
    if (!skillData.skill_name) {
      return res.status(400).json({ msg: "Skill name is required" });
    }
    const sql = "INSERT INTO skills SET ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, skillData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return res
      .status(201)
      .json({ msg: "Skill created successfully", skill_id: result.insertId });
  } catch (error) {
    console.error("Error in createSkill:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create multiple skills
const createMultipleSkills = async (req, res) => {
  try {
    const skills = req.body;
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ msg: "An array of skills is required" });
    }
    const sql = "INSERT INTO skills (skill_name) VALUES ?";
    const values = skills.map((skill) => [skill.skill_name]);
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [values], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return res
      .status(201)
      .json({
        msg: "Skills created successfully",
        affectedRows: result.affectedRows,
      });
  } catch (error) {
    console.error("Error in createMultipleSkills:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all skills
const getAllSkills = async (req, res) => {
  try {
    const sql = "SELECT * FROM skills";
    const skills = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error in getAllSkills:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get active skills
const getActiveSkills = async (req, res) => {
  try {
    const sql = "SELECT * FROM skills WHERE skill_status = 1";
    const activeSkills = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return res.status(200).json(activeSkills);
  } catch (error) {
    console.error("Error in getActiveSkills:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get skill by ID
const getSkillById = async (req, res) => {
  try {
    const sql = "SELECT * FROM skills WHERE skill_id = ?";
    const skill = await new Promise((resolve, reject) => {
      db.query(sql, [req.params.skill_id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
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
    const sql = "UPDATE skills SET ? WHERE skill_id = ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [req.body, req.params.skill_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
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
    const skillId = req.params.skill_id;
    const deleteStudentSkillsSql =
      "DELETE FROM student_skills WHERE skill_id = ?";
    await new Promise((resolve, reject) => {
      db.query(deleteStudentSkillsSql, [skillId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    const deleteSkillsSql = "DELETE FROM skills WHERE skill_id = ?";
    const result = await new Promise((resolve, reject) => {
      db.query(deleteSkillsSql, [skillId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
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
    const sql = "INSERT INTO difficultylevels SET ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, levelData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return res
      .status(201)
      .json({ msg: "Level created successfully", level_id: result.insertId });
  } catch (error) {
    console.error("Error in createLevel:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Create multiple difficulty levels
const createMultipleLevels = async (req, res) => {
  try {
    const levels = req.body;
    if (!Array.isArray(levels) || levels.length === 0) {
      return res.status(400).json({ msg: "An array of levels is required" });
    }
    const sql = "INSERT INTO difficultylevels (level_name) VALUES ?";
    const values = levels.map((level) => [level.level_name]);
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [values], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return res
      .status(201)
      .json({
        msg: "Levels created successfully",
        affectedRows: result.affectedRows,
      });
  } catch (error) {
    console.error("Error in createMultipleLevels:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all difficulty levels
const getAllLevels = async (req, res) => {
  try {
    const sql = "SELECT * FROM difficultylevels";
    const levels = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return res.status(200).json(levels);
  } catch (error) {
    console.error("Error in getAllLevels:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get difficulty level by ID
const getLevelById = async (req, res) => {
  try {
    const sql = "SELECT * FROM difficultylevels WHERE level_id = ?";
    const level = await new Promise((resolve, reject) => {
      db.query(sql, [req.params.level_id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
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
    const sql = "UPDATE difficultylevels SET ? WHERE level_id = ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [req.body, req.params.level_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
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
    const sql = "DELETE FROM difficultylevels WHERE level_id = ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [req.params.level_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
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
      return res
        .status(400)
        .json({ msg: "All fields are required, including question_status" });
    }
    mcqData.option = JSON.stringify(mcqData.option);
    const sql =
      "INSERT INTO questions_mcq (skill_id, difficulty_level_id, questions, `option`, correct_answer, question_status) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      mcqData.skill_id,
      mcqData.difficulty_level_id,
      mcqData.questions,
      mcqData.option,
      mcqData.correct_answer,
      mcqData.question_status,
    ];
    const result = await new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return res
      .status(201)
      .json({ msg: "MCQ created successfully", id: result.insertId });
  } catch (error) {
    console.error("Error in createMCQ:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all MCQs
const getAllMcqs = async (req, res) => {
  try {
    const sql = `
      SELECT q.*, s.skill_name, d.level_name
      FROM questions_mcq q
      JOIN skills s ON q.skill_id = s.skill_id
      JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
    `;
    const mcqs = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
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
        console.error(
          `Error parsing option for MCQ ID ${mcq.id}:`,
          error.message
        );
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
    const sql = `
      SELECT q.*, s.skill_name, d.level_name
      FROM questions_mcq q
      JOIN skills s ON q.skill_id = s.skill_id
      JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
      WHERE q.id = ?
    `;
    const mcq = await new Promise((resolve, reject) => {
      db.query(sql, [req.params.id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
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
      console.error(
        `Error parsing option for MCQ ID ${mcq.id}:`,
        error.message
      );
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
    const sql = "UPDATE questions_mcq SET ? WHERE id = ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [mcqData, req.params.id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
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
    const sql = "DELETE FROM questions_mcq WHERE id = ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [req.params.id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
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
    const sql = `
      SELECT q.*, s.skill_name, d.level_name
      FROM questions_mcq q
      JOIN skills s ON q.skill_id = s.skill_id
      JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
      JOIN student_skills ss ON q.skill_id = ss.skill_id
      WHERE ss.student_id = ?
      ORDER BY q.skill_id, q.difficulty_level_id
    `;
    const mcqs = await new Promise((resolve, reject) => {
      db.query(sql, [student_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    if (mcqs.length === 0) {
      return res
        .status(404)
        .json({ msg: "No MCQs found for this student's skills" });
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
        console.error(
          `Error parsing option for MCQ ID ${mcq.id}:`,
          error.message
        );
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
    const sql = "INSERT INTO quiz_attempts SET ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, attemptData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return res
      .status(201)
      .json({
        msg: "Quiz attempt saved successfully",
        attempt_id: result.insertId,
      });
  } catch (error) {
    console.error("Error in saveQuizAttempt:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get quiz attempts
const getQuizAttempts = async (req, res) => {
  try {
    const sql = `
      SELECT qa.*, s.skill_name, d.level_name
      FROM quiz_attempts qa
      JOIN skills s ON qa.skill_id = s.skill_id
      JOIN difficultylevels d ON qa.difficulty_level_id = d.level_id
      WHERE qa.student_id = ?
      ORDER BY qa.attempted_at DESC
    `;
    const attempts = await new Promise((resolve, reject) => {
      db.query(sql, [req.params.student_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    if (attempts.length === 0) {
      return res
        .status(404)
        .json({ msg: "No quiz attempts found for this student" });
    }
    const parsedAttempts = attempts.map((attempt) => {
      let parsedQuestions = [];
      let parsedCorrectAnswer = [];
      let parsedSelectedOption = [];
      try {
        parsedQuestions = JSON.parse(attempt.questions || "[]");
        parsedCorrectAnswer = JSON.parse(attempt.correct_answer || "[]");
        parsedSelectedOption = JSON.parse(attempt.selected_option || "[]");
      } catch (error) {
        console.error(
          `Error parsing quiz attempt ID ${attempt.id}:`,
          error.message
        );
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
    if (
      !test_name ||
      !test_description ||
      !skill_id ||
      !difficulty_level_id ||
      !total_no_of_questions ||
      !duration_minutes
    ) {
      return res
        .status(400)
        .json({
          msg: "All required fields must be provided, including test duration",
        });
    }

    // Validate pass marks
    if (
      easy_pass_mark > easy_level_question ||
      medium_pass_mark > medium_level_question ||
      hard_pass_mark > hard_level_question
    ) {
      return res
        .status(400)
        .json({ msg: "Pass marks cannot exceed the number of questions" });
    }

    // Check available questions
    const questionCountsSql = `
      SELECT 
        s.skill_id,
        s.skill_name,
        COALESCE(SUM(CASE WHEN q.difficulty_level_id = 1 THEN 1 ELSE 0 END), 0) as easy_count,
        COALESCE(SUM(CASE WHEN q.difficulty_level_id = 2 THEN 1 ELSE 0 END), 0) as medium_count,
        COALESCE(SUM(CASE WHEN q.difficulty_level_id = 3 THEN 1 ELSE 0 END), 0) as hard_count
      FROM skills s
      LEFT JOIN questions_mcq q ON s.skill_id = q.skill_id
      GROUP BY s.skill_id, s.skill_name
    `;
    const availableQuestions = await new Promise((resolve, reject) => {
      db.query(questionCountsSql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    const skillQuestions = availableQuestions.find(
      (q) => q.skill_id === Number(skill_id)
    );
    if (!skillQuestions) {
      return res
        .status(400)
        .json({ msg: "No questions available for the selected skill" });
    }

    const easyShortage = easy_level_question - skillQuestions.easy_count;
    const mediumShortage = medium_level_question - skillQuestions.medium_count;
    const hardShortage = hard_level_question - skillQuestions.hard_count;
    if (easyShortage > 0 || mediumShortage > 0 || hardShortage > 0) {
      const errors = [];
      if (easyShortage > 0) {
        errors.push(
          `Please add ${easyShortage} more Easy questions. Only ${skillQuestions.easy_count} available.`
        );
      }
      if (mediumShortage > 0) {
        errors.push(
          `Please add ${mediumShortage} more Medium questions. Only ${skillQuestions.medium_count} available.`
        );
      }
      if (hardShortage > 0) {
        errors.push(
          `Please add ${hardShortage} more Hard questions. Only ${skillQuestions.hard_count} available.`
        );
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

    const sql = "INSERT INTO testcreation SET ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, testData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return res
      .status(201)
      .json({ msg: "Test created successfully", test_id: result.insertId });
  } catch (error) {
    console.error("Error in createTest:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get available question counts by skill and difficulty level
const getAvailableQuestions = async (req, res) => {
  try {
    const sql = `
      SELECT 
        s.skill_id,
        s.skill_name,
        COALESCE(SUM(CASE WHEN q.difficulty_level_id = 1 THEN 1 ELSE 0 END), 0) as easy_count,
        COALESCE(SUM(CASE WHEN q.difficulty_level_id = 2 THEN 1 ELSE 0 END), 0) as medium_count,
        COALESCE(SUM(CASE WHEN q.difficulty_level_id = 3 THEN 1 ELSE 0 END), 0) as hard_count
      FROM skills s
      LEFT JOIN questions_mcq q ON s.skill_id = q.skill_id
      GROUP BY s.skill_id, s.skill_name
    `;
    const questionCounts = await new Promise((resolve, reject) => {
      db.query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return res.status(200).json(questionCounts);
  } catch (error) {
    console.error("Error in getAvailableQuestions:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all tests
const getAllTests = async (req, res) => {
  try {
    const sql = `
      SELECT t.*, s.skill_name, d.level_name
      FROM testcreation t
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
    `;
    const tests = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return res.status(200).json(tests);
  } catch (error) {
    console.error("Error in getAllTests:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const sql = "SELECT student_id, name FROM students";
    const students = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
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
    if (
      !test_id ||
      !student_ids ||
      !Array.isArray(student_ids) ||
      student_ids.length === 0
    ) {
      return res
        .status(400)
        .json({ msg: "Test ID and student IDs are required" });
    }
    const sql =x``
      "INSERT INTO testassigned (test_id, student_id, active_status) VALUES ?";
    const values = student_ids.map((student_id) => [
      test_id,
      student_id,
      active_status,
    ]);
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [values], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return res
      .status(201)
      .json({
        msg: "Test assigned successfully",
        affectedRows: result.affectedRows,
      });
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
      return res
        .status(400)
        .json({ msg: "Test ID and active status are required" });
    }
    const status = active_status ? 1 : 0;
    const testAssignedSql = `
      UPDATE testassigned 
      SET active_status = ? 
      WHERE test_id = ?
    `;
    const skillTestsSql = `
      UPDATE testassigned 
      SET active_status = ? 
      WHERE test_id = ?
    `;
    const [testAssignedResult, skillTestsResult] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(testAssignedSql, [status, test_id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(skillTestsSql, [status, test_id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      }),
    ]);
    if (
      testAssignedResult.affectedRows === 0 &&
      skillTestsResult.affectedRows === 0
    ) {
      return res.status(404).json({ msg: "No tests found with this test ID" });
    }
    return res.status(200).json({
      msg: `Test status updated to ${status ? "active" : "inactive"}`,
      testAssignedAffected: testAssignedResult.affectedRows,
      skillTestsAffected: skillTestsResult.affectedRows,
    });
  } catch (error) {
    console.error("Error in toggleTestStatusForAll:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get assigned students
const getAssignedStudents = async (req, res) => {
  try {
    const sql = `
      SELECT ta.student_id, s.name, ta.active_status
      FROM testassigned ta
      JOIN students s ON ta.student_id = s.student_id
      WHERE ta.test_id = ?
    `;
    const students = await new Promise((resolve, reject) => {
      db.query(sql, [req.params.test_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
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
    const sqlAssignedTests = `
      SELECT 
        t.test_id,
        t.test_name,
        t.test_description,
        t.skill_id,
        t.difficulty_level_id,
        t.easy_level_question,
        t.medium_level_question,
        t.hard_level_question,
        t.total_no_of_questions,
        t.easy_pass_mark,
        t.medium_pass_mark,
        t.hard_pass_mark,
        t.created_at,
        s.skill_name,
        d.level_name,
        'assigned' AS test_type
      FROM testcreation t
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
      JOIN testassigned ta ON t.test_id = ta.test_id
      WHERE ta.student_id = ? AND ta.active_status = 1
    `;
    const sqlSkillTests = `
      SELECT 
        t.test_id,
        t.test_name,
        t.test_description,
        t.skill_id,
        t.difficulty_level_id,
        t.easy_level_question,
        t.medium_level_question,
        t.hard_level_question,
        t.total_no_of_questions,
        t.easy_pass_mark,
        t.medium_pass_mark,
        t.hard_pass_mark,
        t.created_at,
        s.skill_name,
        d.level_name,
        'skill' AS test_type
      FROM testcreation t
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
      JOIN student_skills ss ON t.skill_id = ss.skill_id
      WHERE ss.student_id = ?
    `;
    const [assignedTests, skillTests] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(sqlAssignedTests, [student_id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(sqlSkillTests, [student_id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
    ]);
    const allTests = [...assignedTests, ...skillTests];
    const testsWithQuestions = [];
    const fetchQuestionsForLevel = async (
      difficultyId,
      count,
      skillId,
      excludeIds = []
    ) => {
      const validExcludeIds = excludeIds
        .filter(
          (id) => id != null && !isNaN(id) && Number.isInteger(Number(id))
        )
        .map(Number);
      let sql = `
        SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
        FROM questions_mcq
        WHERE skill_id = ? AND difficulty_level_id = ?
      `;
      const params = [skillId, difficultyId];
      if (validExcludeIds.length > 0) {
        sql += ` AND id NOT IN (${validExcludeIds.map(() => "?").join(",")})`;
        params.push(...validExcludeIds);
      }
      sql += ` ORDER BY RAND() LIMIT ?`;
      params.push(count);
      return new Promise((resolve, reject) => {
        db.query(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    };
    for (const test of allTests) {
      const {
        skill_id,
        easy_level_question,
        medium_level_question,
        hard_level_question,
        difficulty_level_id,
        test_id,
        test_name,
      } = test;
      try {
        const primaryQuestions = { easy: [], medium: [], hard: [] };
        let usedQuestionIds = [];
        if (difficulty_level_id >= 1 && easy_level_question > 0) {
          const easyQuestions = await fetchQuestionsForLevel(
            1,
            easy_level_question,
            skill_id,
            usedQuestionIds
          );
          if (easyQuestions.length < easy_level_question) {
            throw new Error(
              `Please add ${
                easy_level_question - easyQuestions.length
              } more Easy questions for test ${test_name} (ID: ${test_id}). Only ${
                easyQuestions.length
              } available.`
            );
          }
          primaryQuestions.easy = easyQuestions;
          usedQuestionIds = [
            ...usedQuestionIds,
            ...easyQuestions.map((q) => q.id),
          ];
        }
        if (difficulty_level_id >= 2 && medium_level_question > 0) {
          const mediumQuestions = await fetchQuestionsForLevel(
            2,
            medium_level_question,
            skill_id,
            usedQuestionIds
          );
          if (mediumQuestions.length < medium_level_question) {
            throw new Error(
              `Please add ${
                medium_level_question - mediumQuestions.length
              } more Medium questions for test ${test_name} (ID: ${test_id}). Only ${
                mediumQuestions.length
              } available.`
            );
          }
          primaryQuestions.medium = mediumQuestions;
          usedQuestionIds = [
            ...usedQuestionIds,
            ...mediumQuestions.map((q) => q.id),
          ];
        }
        if (difficulty_level_id === 3 && hard_level_question > 0) {
          const hardQuestions = await fetchQuestionsForLevel(
            3,
            hard_level_question,
            skill_id,
            usedQuestionIds
          );
          if (hardQuestions.length < hard_level_question) {
            throw new Error(
              `Please add ${
                hard_level_question - hardQuestions.length
              } more Hard questions for test ${test_name} (ID: ${test_id}). Only ${
                hardQuestions.length
              } available.`
            );
          }
          primaryQuestions.hard = hardQuestions;
          usedQuestionIds = [
            ...usedQuestionIds,
            ...hardQuestions.map((q) => q.id),
          ];
        }
        const parseQuestions = (questions) =>
          questions.map((q) => {
            let parsedOption = [];
            try {
              if (Array.isArray(q.option)) {
                parsedOption = q.option;
              } else if (
                typeof q.option === "string" &&
                q.option.trim() !== ""
              ) {
                parsedOption = JSON.parse(q.option);
                if (!Array.isArray(parsedOption)) {
                  throw new Error(
                    `Invalid option format for question ID ${q.id}`
                  );
                }
              }
            } catch (error) {
              console.error(
                `Error parsing option for question ID ${q.id}:`,
                error.message
              );
              parsedOption = [];
            }
            return {
              ...q,
              option: parsedOption,
            };
          });
        testsWithQuestions.push({
          ...test,
          primary_questions: {
            easy: parseQuestions(primaryQuestions.easy),
            medium: parseQuestions(primaryQuestions.medium),
            hard: parseQuestions(primaryQuestions.hard),
          },
          additional_questions: {
            easy: [],
            medium: [],
            hard: [],
          },
        });
      } catch (error) {
        console.error(
          `Error processing test ${test_name} (ID: ${test_id}):`,
          error.message
        );
        testsWithQuestions.push({
          ...test,
          primary_questions: { easy: [], medium: [], hard: [] },
          additional_questions: { easy: [], medium: [], hard: [] },
          error: error.message,
        });
      }
    }
    return res.status(200).json(testsWithQuestions);
  } catch (error) {
    console.error("Error in getAllTestsWithQuestions:", error);
    return res
      .status(400)
      .json({ msg: error.message || "Failed to fetch tests" });
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
      return res
        .status(400)
        .json({
          msg: "Test ID, student ID, answers, student level, percentage, and attempt ID are required",
        });
    }
    const completeSql = `UPDATE test_attempts SET completed = TRUE WHERE id = ?`;
    await new Promise((resolve, reject) => {
      db.query(completeSql, [attempt_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    const sqlAssignedTests = `
      SELECT 
        t.test_id,
        t.test_name,
        t.test_description,
        t.skill_id,
        t.difficulty_level_id,
        t.easy_level_question,
        t.medium_level_question,
        t.hard_level_question,
        t.total_no_of_questions,
        t.easy_pass_mark,
        t.medium_pass_mark,
        t.hard_pass_mark,
        t.created_at,
        s.skill_name,
        d.level_name,
        'assigned' AS test_type
      FROM testcreation t
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
      JOIN testassigned ta ON t.test_id = ta.test_id
      WHERE ta.student_id = ? AND ta.active_status = 1
    `;
    const sqlSkillTests = `
      SELECT 
        t.test_id,
        t.test_name,
        t.test_description,
        t.skill_id,
        t.difficulty_level_id,
        t.easy_level_question,
        t.medium_level_question,
        t.hard_level_question,
        t.total_no_of_questions,
        t.easy_pass_mark,
        t.medium_pass_mark,
        t.hard_pass_mark,
        t.created_at,
        s.skill_name,
        d.level_name,
        'skill' AS test_type
      FROM testcreation t
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
      JOIN student_skills ss ON t.skill_id = ss.skill_id
      WHERE ss.student_id = ?
    `;
    const [assignedTests, skillTests] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(sqlAssignedTests, [student_id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(sqlSkillTests, [student_id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
    ]);
    const tests = [...assignedTests, ...skillTests];
    const test = tests.find((t) => t.test_id === Number(test_id));
    if (!test) {
      return res
        .status(404)
        .json({ msg: "Test not found or not available for this student" });
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
      return res
        .status(400)
        .json({ msg: "Submitted scores exceed maximum possible values" });
    }
    const totalQuestions = test.total_no_of_questions;
    const correctEasy = easy_score;
    const correctMedium = medium_score;
    const correctHard = hard_score;
    const correctCount = correctEasy + correctMedium + correctHard;
    if (
      incorrect_answer_count > totalQuestions - correctCount ||
      incorrect_answer_count < 0
    ) {
      return res.status(400).json({ msg: "Incorrect answer count is invalid" });
    }
    let expectedLevel = "Failed";
    if (easy_score >= test.easy_pass_mark) {
      expectedLevel = "Easy";
      if (
        test.difficulty_level_id >= 2 &&
        medium_score >= test.medium_pass_mark
      ) {
        expectedLevel = "Medium";
        if (
          test.difficulty_level_id === 3 &&
          hard_score >= test.hard_pass_mark
        ) {
          expectedLevel = "Hard";
        }
      }
    }
    if (student_level !== expectedLevel) {
      return res
        .status(400)
        .json({ msg: "Invalid student level based on scores" });
    }
    const checkSql = `
      SELECT id
      FROM testresults
      WHERE test_id = ? AND student_id = ? AND attend_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MINUTE)
    `;
    const existingResults = await new Promise((resolve, reject) => {
      db.query(checkSql, [test_id, student_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    if (existingResults.length > 0) {
      return res
        .status(400)
        .json({
          msg: "Test result already submitted for this test and student.",
        });
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
    const insertSql = `
      INSERT INTO testresults (
        test_id, student_id, easy_score, medium_score, hard_score,
        total_score, incorrect_answer_count, student_level, percentage, attend_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const result = await new Promise((resolve, reject) => {
      db.query(
        insertSql,
        [
          test_id,
          student_id,
          easy_score,
          medium_score,
          hard_score,
          total_score,
          incorrect_answer_count,
          student_level,
          percentage,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    return res
      .status(201)
      .json({
        msg: "Test results saved successfully",
        result_id: result.insertId,
      });
  } catch (error) {
    console.error("Error in submitTest:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get questions by skill and difficulty level
// const getQuestionsBySkillAndLevel = async (req, res) => {
//   try {
//     const { skill_id, level_id } = req.params;
//     const { count = 10, exclude } = req.query;
//     const excludeIds = exclude ? exclude.split(",").map(Number) : [];
//     let sql = `
//       SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
//       FROM questions_mcq
//       WHERE skill_id = ? AND difficulty_level_id = ?
//     `;
//     const params = [skill_id, level_id];
//     if (excludeIds.length > 0) {
//       sql += ` AND id NOT IN (${excludeIds.map(() => "?").join(",")})`;
//       params.push(...excludeIds);
//     }
//     sql += ` ORDER BY RAND() LIMIT ?`;
//     params.push(parseInt(count));
//     const questions = await new Promise((resolve, reject) => {
//       db.query(sql, params, (err, results) => {
//         if (err) reject(err);
//         else resolve(results);
//       });
//     });
//     const parsedQuestions = questions.map((q) => {
//       let parsedOption = [];
//       try {
//         if (Array.isArray(q.option)) {
//           parsedOption = q.option;
//         } else if (typeof q.option === "string" && q.option.trim() !== "") {
//           parsedOption = JSON.parse(q.option);
//           if (!Array.isArray(parsedOption)) {
//             throw new Error(`Invalid option format for question ID ${q.id}`);
//           }
//         }
//       } catch (error) {
//         console.error(
//           `Error parsing option for question ID ${q.id}:`,
//           error.message
//         );
//         parsedOption = [];
//       }
//       return {
//         ...q,
//         option: parsedOption,
//       };
//     });
//     return res.status(200).json(parsedQuestions);
//   } catch (error) {
//     console.error("Error in getQuestionsBySkillAndLevel:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };


const getQuestionsBySkillAndLevel = async (req, res) => {
  try {
    const { skill_id, level_id } = req.params;
    const { count = 10, exclude } = req.query;
    const excludeIds = exclude ? exclude.split(",").map(Number) : [];
    let sql = `
      SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
      FROM questions_mcq
      WHERE skill_id = ? AND difficulty_level_id = ?
    `;
    const params = [skill_id, level_id];
    if (excludeIds.length > 0) {
      sql += ` AND id NOT IN (${excludeIds.map(() => "?").join(",")})`;
      params.push(...excludeIds);
    }
    sql += ` ORDER BY RAND() LIMIT ?`;
    params.push(parseInt(count));
    const questions = await new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
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
        console.error(
          `Error parsing option for question ID ${q.id}:`,
          error.message
        );
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
      return res
        .status(400)
        .json({ msg: "Student ID, test ID, and datetime are required" });
    }
    const sql = `
      INSERT INTO test_schedules (student_id, test_id, datetime)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE datetime = ?, created_at = CURRENT_TIMESTAMP
    `;
    const result = await new Promise((resolve, reject) => {
      db.query(
        sql,
        [student_id, test_id, datetime, datetime],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    return res
      .status(200)
      .json({
        msg: "Test schedule saved successfully",
        schedule_id: result.insertId,
      });
  } catch (error) {
    console.error("Error in saveTestSchedule:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get test schedules for a student
const getTestSchedules = async (req, res) => {
  try {
    const student_id = req.params.student_id;
    const sql = `
      SELECT test_id, datetime
      FROM test_schedules
      WHERE student_id = ?
    `;
    const schedules = await new Promise((resolve, reject) => {
      db.query(sql, [student_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
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
          msg: `Invalid MCQ: ${JSON.stringify(
            mcq
          )}. All fields (questions, option, correct_answer, skill_id, difficulty_level_id, question_status) are required.`,
        });
      }
      for (const opt of mcq.option) {
        if (!opt.option || !opt.feedback) {
          return res.status(400).json({
            msg: `Invalid option in MCQ: ${JSON.stringify(
              mcq
            )}. Each option must have option text and feedback.`,
          });
        }
      }
      if (!mcq.option.some((opt) => opt.option === mcq.correct_answer)) {
        return res.status(400).json({
          msg: `Correct answer "${mcq.correct_answer}" in MCQ does not match any option.`,
        });
      }
      const mcqData = {
        ...mcq,
        option: JSON.stringify(mcq.option),
      };
      const sql =
        "INSERT INTO questions_mcq (skill_id, difficulty_level_id, questions, `option`, correct_answer, question_status) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        mcqData.skill_id,
        mcqData.difficulty_level_id,
        mcqData.questions,
        mcqData.option,
        mcqData.correct_answer,
        mcqData.question_status,
      ];
      const result = await new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
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
    const sql = `
      SELECT test_id
      FROM testresults
      WHERE student_id = ?
    `;
    const results = await new Promise((resolve, reject) => {
      db.query(sql, [student_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
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
      return res
        .status(400)
        .json({ msg: "Student ID, test ID, and test type are required" });
    }
    const checkSql = `
      SELECT ta.*, tc.duration_minutes
      FROM test_attempts ta
      JOIN testcreation tc ON ta.test_id = tc.test_id
      WHERE ta.student_id = ? AND ta.test_id = ? AND ta.test_type = ? AND ta.completed = FALSE
    `;
    const existingAttempts = await new Promise((resolve, reject) => {
      db.query(checkSql, [student_id, test_id, test_type], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    if (existingAttempts.length > 0) {
      const attempt = existingAttempts[0];
      const startTime = new Date(attempt.start_time);
      const durationMinutes = attempt.duration_minutes || 30;
      const durationMs = durationMinutes * 60 * 1000;
      const endTime = new Date(startTime.getTime() + durationMs);
      const now = new Date();
      const timeLeftMs = endTime - now;
      const timeLeftSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
      return res.status(200).json({
        attempt_id: attempt.id,
        time_left_seconds: timeLeftSeconds,
        start_time: startTime.toISOString(),
      });
    }
    const checkResultSql = `
      SELECT id
      FROM testresults
      WHERE test_id = ? AND student_id = ?
    `;
    const resultExists = await new Promise((resolve, reject) => {
      db.query(checkResultSql, [test_id, student_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    if (resultExists.length > 0) {
      return res
        .status(400)
        .json({ msg: "Test has already been completed by this student." });
    }
    const startTime = new Date();
    const insertSql = `
      INSERT INTO test_attempts (student_id, test_id, test_type, start_time)
      VALUES (?, ?, ?, ?)
    `;
    const insertResult = await new Promise((resolve, reject) => {
      db.query(
        insertSql,
        [student_id, test_id, test_type, startTime],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    const durationSql = `
      SELECT duration_minutes
      FROM testcreation
      WHERE test_id = ?
    `;
    const durationResult = await new Promise((resolve, reject) => {
      db.query(durationSql, [test_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (durationResult.length === 0) {
      return res.status(404).json({ msg: "Test not found in testcreation" });
    }
    const durationMinutes = durationResult[0].duration_minutes || 30;
    const timeLeftSeconds = durationMinutes * 60;
    return res.status(200).json({
      attempt_id: insertResult.insertId,
      time_left_seconds: timeLeftSeconds,
      start_time: startTime.toISOString(),
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
    const sql = `
      SELECT ta.start_time, ta.completed, tc.duration_minutes
      FROM test_attempts ta
      JOIN testcreation tc ON ta.test_id = tc.test_id
      WHERE ta.id = ?
    `;
    const results = await new Promise((resolve, reject) => {
      db.query(sql, [attempt_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    if (results.length === 0) {
      return res.status(404).json({ msg: "Test attempt not found" });
    }
    const attempt = results[0];
    if (attempt.completed) {
      return res.status(200).json(0);
    }
    const startTime = new Date(attempt.start_time);
    const durationMinutes = attempt.duration_minutes || 30;
    const durationMs = durationMinutes * 60 * 1000;
    const endTime = new Date(startTime.getTime() + durationMs);
    const now = new Date();
    const timeLeftMs = endTime - now;
    const timeLeftSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
    return res.status(200).json({ time_left_seconds: timeLeftSeconds });
  } catch (error) {
    console.error("Error in getTestTime:", error);
    return res.status(500).json({ msg: error.message || "Server error" });
  }
};


const toggleTestStatusForSkillBased = async (req, res) => {
  try {
    const { test_id, active_status } = req.body;
    if (!test_id || active_status === undefined) {
      return res
        .status(400)
        .json({ msg: "Test ID and active status are required" });
    }
    const status = active_status ? 1 : 0;
    const sql = `
      UPDATE testcreation 
      SET active_status = ? 
      WHERE test_id = ?
    `;
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [status, test_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "No test found with this test ID" });
    }
    return res.status(200).json({
      msg: `Test status updated to ${status ? "active" : "inactive"}`,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error in toggleTestStatusForSkillBased:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};



const getActiveTestsWithQuestions = async (req, res) => {
  try {
    const { student_id } = req.params;
    const sqlAssignedTests = `
      SELECT 
        t.test_id,
        t.test_name,
        t.test_description,
        t.skill_id,
        t.difficulty_level_id,
        t.easy_level_question,
        t.medium_level_question,
        t.hard_level_question,
        t.total_no_of_questions,
        t.easy_pass_mark,
        t.medium_pass_mark,
        t.hard_pass_mark,
        t.created_at,
        s.skill_name,
        d.level_name,
        'assigned' AS test_type
      FROM testcreation t
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
      JOIN testassigned ta ON t.test_id = ta.test_id
      WHERE ta.student_id = ? AND t.active_status = 1
    `;
    const sqlSkillTests = `
      SELECT 
        t.test_id,
        t.test_name,
        t.test_description,
        t.skill_id,
        t.difficulty_level_id,
        t.easy_level_question,
        t.medium_level_question,
        t.hard_level_question,
        t.total_no_of_questions,
        t.easy_pass_mark,
        t.medium_pass_mark,
        t.hard_pass_mark,
        t.created_at,
        s.skill_name,
        d.level_name,
        'skill' AS test_type
      FROM testcreation t
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
      JOIN student_skills ss ON t.skill_id = ss.skill_id
      WHERE ss.student_id = ? AND t.active_status = 1
    `;
    const [assignedTests, skillTests] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(sqlAssignedTests, [student_id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(sqlSkillTests, [student_id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
    ]);
    const allTests = [...assignedTests, ...skillTests];
    const testsWithQuestions = [];
    const fetchQuestionsForLevel = async (
      difficultyId,
      count,
      skillId,
      excludeIds = []
    ) => {
      const validExcludeIds = excludeIds
        .filter(
          (id) => id != null && !isNaN(id) && Number.isInteger(Number(id))
        )
        .map(Number);
      let sql = `
        SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
        FROM questions_mcq
        WHERE skill_id = ? AND difficulty_level_id = ?
      `;
      const params = [skillId, difficultyId];
      if (validExcludeIds.length > 0) {
        sql += ` AND id NOT IN (${validExcludeIds.map(() => "?").join(",")})`;
        params.push(...validExcludeIds);
      }
      sql += ` ORDER BY RAND() LIMIT ?`;
      params.push(count);
      return new Promise((resolve, reject) => {
        db.query(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    };
    for (const test of allTests) {
      const {
        skill_id,
        easy_level_question,
        medium_level_question,
        hard_level_question,
        difficulty_level_id,
        test_id,
        test_name,
      } = test;
      try {
        const primaryQuestions = { easy: [], medium: [], hard: [] };
        let usedQuestionIds = [];
        if (difficulty_level_id >= 1 && easy_level_question > 0) {
          const easyQuestions = await fetchQuestionsForLevel(
            1,
            easy_level_question,
            skill_id,
            usedQuestionIds
          );
          if (easyQuestions.length < easy_level_question) {
            throw new Error(
              `Please add ${
                easy_level_question - easyQuestions.length
              } more Easy questions for test ${test_name} (ID: ${test_id}). Only ${
                easyQuestions.length
              } available.`
            );
          }
          primaryQuestions.easy = easyQuestions;
          usedQuestionIds = [
            ...usedQuestionIds,
            ...easyQuestions.map((q) => q.id),
          ];
        }
        if (difficulty_level_id >= 2 && medium_level_question > 0) {
          const mediumQuestions = await fetchQuestionsForLevel(
            2,
            medium_level_question,
            skill_id,
            usedQuestionIds
          );
          if (mediumQuestions.length < medium_level_question) {
            throw new Error(
              `Please add ${
                medium_level_question - mediumQuestions.length
              } more Medium questions for test ${test_name} (ID: ${test_id}). Only ${
                mediumQuestions.length
              } available.`
            );
          }
          primaryQuestions.medium = mediumQuestions;
          usedQuestionIds = [
            ...usedQuestionIds,
            ...mediumQuestions.map((q) => q.id),
          ];
        }
        if (difficulty_level_id === 3 && hard_level_question > 0) {
          const hardQuestions = await fetchQuestionsForLevel(
            3,
            hard_level_question,
            skill_id,
            usedQuestionIds
          );
          if (hardQuestions.length < hard_level_question) {
            throw new Error(
              `Please add ${
                hard_level_question - hardQuestions.length
              } more Hard questions for test ${test_name} (ID: ${test_id}). Only ${
                hardQuestions.length
              } available.`
            );
          }
          primaryQuestions.hard = hardQuestions;
          usedQuestionIds = [
            ...usedQuestionIds,
            ...hardQuestions.map((q) => q.id),
          ];
        }
        const parseQuestions = (questions) =>
          questions.map((q) => {
            let parsedOption = [];
            try {
              if (Array.isArray(q.option)) {
                parsedOption = q.option;
              } else if (
                typeof q.option === "string" &&
                q.option.trim() !== ""
              ) {
                parsedOption = JSON.parse(q.option);
                if (!Array.isArray(parsedOption)) {
                  throw new Error(
                    `Invalid option format for question ID ${q.id}`
                  );
                }
              }
            } catch (error) {
              console.error(
                `Error parsing option for question ID ${q.id}:`,
                error.message
              );
              parsedOption = [];
            }
            return {
              ...q,
              option: parsedOption,
            };
          });
        testsWithQuestions.push({
          ...test,
          primary_questions: {
            easy: parseQuestions(primaryQuestions.easy),
            medium: parseQuestions(primaryQuestions.medium),
            hard: parseQuestions(primaryQuestions.hard),
          },
          additional_questions: {
            easy: [],
            medium: [],
            hard: [],
          },
        });
      } catch (error) {
        console.error(
          `Error processing test ${test_name} (ID: ${test_id}):`,
          error.message
        );
        testsWithQuestions.push({
          ...test,
          primary_questions: { easy: [], medium: [], hard: [] },
          additional_questions: { easy: [], medium: [], hard: [] },
          error: error.message,
        });
      }
    }
    return res.status(200).json(testsWithQuestions);
  } catch (error) {
    console.error("Error in getActiveTestsWithQuestions:", error);
    return res
      .status(400)
      .json({ msg: error.message || "Failed to fetch active tests" });
  }
};


export default {
  createSkill,
  createMultipleSkills,
  getAllSkills,
  getActiveSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  createLevel,
  createMultipleLevels,
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
  createBulkMcq,
  studentTestAttended,
  startTest,
  getTestTime,
  toggleTestStatusForSkillBased,
  getActiveTestsWithQuestions
};
