import db from "../config/db.js";

// Create a single skill
const createSkill = async (skill_name) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO skills (skill_name) VALUES (?)";
    db.query(sql, [skill_name], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Create multiple skills
const createMultipleSkills = async (skill_names) => {
  return new Promise((resolve, reject) => {
    const values = skill_names.map((name) => [name]);
    const sql = "INSERT INTO skills (skill_name) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get all skills
const getAllSkills = async () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM skills";
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Get skill by ID
const getSkillById = async (skill_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM skills WHERE skill_id = ?";
    db.query(sql, [skill_id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Update skill by ID
const updateSkill = async (skill_id, skill_name) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE skills SET skill_name = ? WHERE skill_id = ?";
    db.query(sql, [skill_name, skill_id], (err, result) => {
      if (err) reject(err);
      else resolve(result.affectedRows === 0 ? null : { skill_id, skill_name });
    });
  });
};

// Delete skill
const deleteSkill = async (skill_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM skills WHERE skill_id = ?";
    db.query(sql, [skill_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Create a single difficulty level
const createLevel = async (level_name) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO difficultylevels (level_name) VALUES (?)";
    db.query(sql, [level_name], (err, result) => {
      if (err) reject(err);
      else resolve({ level_id: result.insertId, level_name });
    });
  });
};

// Create multiple difficulty levels
const createMultipleLevels = async (levelNames) => {
  return new Promise((resolve, reject) => {
    const values = levelNames.map((name) => [name]);
    const sql = "INSERT INTO difficultylevels (level_name) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) reject(err);
      else resolve({ inserted_count: result.affectedRows });
    });
  });
};

// Get all difficulty levels
const getAllLevels = async () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM difficultylevels";
    db.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get difficulty level by ID
const getLevelById = async (level_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM difficultylevels WHERE level_id = ?";
    db.query(sql, [level_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]);
    });
  });
};

// Update difficulty level
const updateLevel = async (level_id, level_name) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE difficultylevels SET level_name = ? WHERE level_id = ?";
    db.query(sql, [level_name, level_id], (err, result) => {
      if (err) reject(err);
      else resolve(result.affectedRows === 0 ? null : { level_id, level_name });
    });
  });
};

// Delete difficulty level
const deleteLevel = async (level_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM difficultylevels WHERE level_id = ?";
    db.query(sql, [level_id], (err, result) => {
      if (err) reject(err);
      else resolve(result.affectedRows);
    });
  });
};

// Create a single MCQ
const createMCQ = async (skill_id, difficulty_level_id, questions, option, correct_answer) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO questions_mcq (skill_id, difficulty_level_id, questions, `option`, correct_answer) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [skill_id, difficulty_level_id, questions, JSON.stringify(option), correct_answer], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get all MCQs
const getAllMcqs = async () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM questions_mcq";
    db.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get MCQ by ID
const getMcqById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM questions_mcq WHERE id = ?";
    db.query(sql, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]);
    });
  });
};

// Update MCQ
const updateMcq = async (id, data) => {
  return new Promise((resolve, reject) => {
    const { skill_id, difficulty_level_id, questions, option, correct_answer } = data;
    const sql =
      "UPDATE questions_mcq SET skill_id = ?, difficulty_level_id = ?, questions = ?, `option` = ?, correct_answer = ? WHERE id = ?";
    db.query(sql, [skill_id, difficulty_level_id, questions, JSON.stringify(option), correct_answer, id], (err, result) => {
      if (err) reject(err);
      else resolve(result.affectedRows === 0 ? null : { id, ...data });
    });
  });
};

// Delete MCQ
const deleteMcq = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM questions_mcq WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result.affectedRows);
    });
  });
};

// Get MCQs by student's skills
const getMcqsByStudentSkills = async (student_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.id, q.questions, q.option, q.correct_answer
      FROM questions_mcq q
      JOIN student_skills ss ON q.skill_id = ss.skill_id
      WHERE ss.student_id = ?
    `;
    db.query(sql, [student_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get entry test questions by student's skills
const getEntryTestQuestionsByStudentSkills = async (student_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        q.id, 
        q.questions AS question_text, 
        q.option AS options, 
        q.correct_answer, 
        q.difficulty_level_id
      FROM questions_mcq q
      JOIN student_skills ss ON q.skill_id = ss.skill_id
      WHERE ss.student_id = ?
      ORDER BY RAND()
    `;
    db.query(sql, [student_id], (err, rows) => {
      if (err) reject(err);
      else {
        const parsedRows = rows.map((row) => ({
          ...row,
          options: JSON.parse(row.options),
        }));
        resolve(parsedRows);
      }
    });
  });
};

// Create a quiz attempt
const createQuizAttempt = async (student_id, quiz_score) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO quizattempts (student_id, quiz_score) VALUES (?, ?)";
    db.query(sql, [student_id, quiz_score], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get quiz attempts by student ID
const getQuizAttemptsByStudentId = async (student_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM quizattempts WHERE student_id = ?";
    db.query(sql, [student_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Save entry test result
const saveEntryTestResult = async (student_id, score) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO quizattempts (student_id, quiz_score, attempt_type) VALUES (?, ?, 'entry_test')";
    db.query(sql, [student_id, score], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Create a test
const createTest = async (testData) => {
  return new Promise((resolve, reject) => {
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
    } = testData;
    const sql = `
      INSERT INTO testcreation (
        test_name, test_description, skill_id, difficulty_level_id,
        easy_level_question, medium_level_question, hard_level_question,
        total_no_of_questions, easy_pass_mark, medium_pass_mark, hard_pass_mark
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
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
      ],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// Get available question counts by skill and difficulty level
const getAvailableQuestions = async () => {
  return new Promise((resolve, reject) => {
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
    db.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get all tests with skill and difficulty level names
const getAllTests = async () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        t.*,
        s.skill_name,
        d.level_name
      FROM testcreation t
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
    `;
    db.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get all students
const getAllStudents = async () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT student_id, name FROM students";
    db.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Assign a test to a student
const assignTest = async (testId, studentId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO testassigned (test_id, student_id, assign_status)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE assign_status = 1
    `;
    db.query(sql, [testId, studentId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get assigned students for a test
const getAssignedStudents = async (testId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        ta.student_id,
        s.name
      FROM testassigned ta
      JOIN students s ON ta.student_id = s.student_id
      WHERE ta.test_id = ? AND ta.assign_status = 1
    `;
    db.query(sql, [testId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get assigned tests with questions for a student
const getAssignedTestsWithQuestions = async (studentId) => {
  return new Promise((resolve, reject) => {
    const sqlTests = `
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
        d.level_name
      FROM testassigned ta
      JOIN testcreation t ON ta.test_id = t.test_id
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
      WHERE ta.student_id = ? AND ta.assign_status = 1
    `;
    db.query(sqlTests, [studentId], async (err, tests) => {
      if (err) {
        console.error("Error fetching assigned tests:", err);
        reject(err);
        return;
      }
      const testsWithQuestions = [];
      for (const test of tests) {
        const {
          skill_id,
          easy_level_question,
          medium_level_question,
          hard_level_question,
          total_no_of_questions,
          difficulty_level_id,
        } = test;
        // Helper function to fetch questions for a specific difficulty
        const fetchQuestionsForLevel = async (difficultyId, count, excludeIds = []) => {
          let sql = `
            SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
            FROM questions_mcq
            WHERE skill_id = ? AND difficulty_level_id = ?
          `;
          const params = [skill_id, difficultyId];
          if (excludeIds.length > 0) {
            sql += ` AND id NOT IN (${excludeIds.map(() => "?").join(",")})`;
            params.push(...excludeIds);
          }
          sql += ` ORDER BY RAND() LIMIT ?`;
          params.push(count);
          return new Promise((res, rej) => {
            db.query(sql, params, (err, rows) => {
              if (err) rej(err);
              else res(rows);
            });
          });
        };
        try {
          const primaryQuestions = { easy: [], medium: [], hard: [] };
          let usedQuestionIds = [];
          // Fetch primary questions
          if (difficulty_level_id >= 1 && easy_level_question > 0) {
            const easyQuestions = await fetchQuestionsForLevel(1, easy_level_question);
            if (easyQuestions.length < easy_level_question) {
              throw new Error(`Please add ${easy_level_question - easyQuestions.length} more Easy questions for test ${test.test_name}. Only ${easyQuestions.length} available.`);
            }
            primaryQuestions.easy = easyQuestions;
            usedQuestionIds.push(...easyQuestions.map((q) => q.id));
          }
          if (difficulty_level_id >= 2 && medium_level_question > 0) {
            const mediumQuestions = await fetchQuestionsForLevel(2, medium_level_question, usedQuestionIds);
            if (mediumQuestions.length < medium_level_question) {
              throw new Error(`Please add ${medium_level_question - mediumQuestions.length} more Medium questions for test ${test.test_name}. Only ${mediumQuestions.length} available.`);
            }
            primaryQuestions.medium = mediumQuestions;
            usedQuestionIds.push(...mediumQuestions.map((q) => q.id));
          }
          if (difficulty_level_id === 3 && hard_level_question > 0) {
            const hardQuestions = await fetchQuestionsForLevel(3, hard_level_question, usedQuestionIds);
            if (hardQuestions.length < hard_level_question) {
              throw new Error(`Please add ${hard_level_question - hardQuestions.length} more Hard questions for test ${test.test_name}. Only ${hardQuestions.length} available.`);
            }
            primaryQuestions.hard = hardQuestions;
            usedQuestionIds.push(...hardQuestions.map((q) => q.id));
          }
          // Parse options
          const parseQuestions = (questions) =>
            questions.map((q) => ({
              ...q,
              option: JSON.parse(q.option),
            }));
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
          console.error(`Error processing questions for test ${test.test_id}:`, error.message);
          reject(error);
          return;
        }
      }
      resolve(testsWithQuestions);
    });
  });
};

// Save test result
const saveTestResult = async (resultData) => {
  return new Promise((resolve, reject) => {
    const {
      test_id,
      student_id,
      easy_score,
      medium_score,
      hard_score,
      total_score,
      incorrect_answer_count,
      student_level,
      percentage,
    } = resultData;
    const sql = `
      INSERT INTO testresults (
        test_id, student_id, easy_score, medium_score, hard_score,
        total_score, incorrect_answer_count, student_level, percentage, attend_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    db.query(
      sql,
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
};

// Get questions by skill and difficulty level, excluding specified IDs
const getQuestionsBySkillAndLevel = async (skill_id, level_id, excludeIds, count) => {
  return new Promise((resolve, reject) => {
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
    params.push(count);
    db.query(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const parsedRows = rows.map((row) => ({
        ...row,
        option: JSON.parse(row.option),
      }));
      resolve(parsedRows);
    });
  });
};

export default {
  createSkill,
  createMultipleSkills,
  getAllSkills,
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
  getEntryTestQuestionsByStudentSkills,
  createQuizAttempt,
  getQuizAttemptsByStudentId,
  saveEntryTestResult,
  createTest,
  getAvailableQuestions,
  getAllTests,
  getAllStudents,
  assignTest,
  getAssignedStudents,
  getAssignedTestsWithQuestions,
  saveTestResult,
  getQuestionsBySkillAndLevel,
};