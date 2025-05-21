import db from "../config/db.js";

// Create skill
const createSkill = (skillData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO skills SET ?";
    db.query(sql, skillData, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Create multiple skills
const createMultipleSkills = (skills) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO skills (skill_name) VALUES ?";
    const values = skills.map((skill) => [skill.skill_name]);
    db.query(sql, [values], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get all skills
const getAllSkills = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM skills";
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};





const getActiveSkills = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM skills WHERE skill_status = 1";
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


// Get skill by ID
const getSkillById = (skillId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM skills WHERE skill_id = ?";
    db.query(sql, [skillId], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// Update skill
const updateSkill = (skillId, skillData) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE skills SET ? WHERE skill_id = ?";
    db.query(sql, [skillData, skillId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Delete skill
const deleteSkill = (skillId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM skills WHERE skill_id = ?";
    db.query(sql, [skillId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Create difficulty level
const createLevel = (levelData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO difficultylevels SET ?";
    db.query(sql, levelData, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Create multiple difficulty levels
const createMultipleLevels = (levels) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO difficultylevels (level_name) VALUES ?";
    const values = levels.map((level) => [level.level_name]);
    db.query(sql, [values], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get all difficulty levels
const getAllLevels = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM difficultylevels";
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Get difficulty level by ID
const getLevelById = (levelId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM difficultylevels WHERE level_id = ?";
    db.query(sql, [levelId], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// Update difficulty level
const updateLevel = (levelId, levelData) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE difficultylevels SET ? WHERE level_id = ?";
    db.query(sql, [levelData, levelId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Delete difficulty level
const deleteLevel = (levelId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM difficultylevels WHERE level_id = ?";
    db.query(sql, [levelId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Create MCQ
const createMCQ = (mcqData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO questions_mcq SET ?";
    db.query(sql, mcqData, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get all MCQs
const getAllMcqs = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.*, s.skill_name, d.level_name
      FROM questions_mcq q
      JOIN skills s ON q.skill_id = s.skill_id
      JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
    `;
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Get MCQ by ID
const getMcqById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.*, s.skill_name, d.level_name
      FROM questions_mcq q
      JOIN skills s ON q.skill_id = s.skill_id
      JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
      WHERE q.id = ?
    `;
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// Update MCQ
const updateMcq = (id, mcqData) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE questions_mcq SET ? WHERE id = ?";
    db.query(sql, [mcqData, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Delete MCQ
const deleteMcq = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM questions_mcq WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get MCQs by student skills
const getMcqsByStudentSkills = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.*, s.skill_name, d.level_name
      FROM questions_mcq q
      JOIN skills s ON q.skill_id = s.skill_id
      JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
      JOIN student_skills ss ON q.skill_id = ss.skill_id
      WHERE ss.student_id = ?
      ORDER BY q.skill_id, q.difficulty_level_id
    `;
    db.query(sql, [studentId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Get entry test questions by student skills
const getEntryTestQuestionsByStudentSkills = (studentId, limit = 10) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.*, s.skill_name, d.level_name
      FROM questions_mcq q
      JOIN skills s ON q.skill_id = s.skill_id
      JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
      JOIN student_skills ss ON q.skill_id = ss.skill_id
      WHERE ss.student_id = ?
      ORDER BY RAND()
      LIMIT ?
    `;
    db.query(sql, [studentId, limit], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Create quiz attempt
const createQuizAttempt = (attemptData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO quiz_attempts SET ?";
    db.query(sql, attemptData, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get quiz attempts by student ID
const getQuizAttemptsByStudentId = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT qa.*, s.skill_name, d.level_name
      FROM quiz_attempts qa
      JOIN skills s ON qa.skill_id = s.skill_id
      JOIN difficultylevels d ON qa.difficulty_level_id = d.level_id
      WHERE qa.student_id = ?
      ORDER BY qa.attempted_at DESC
    `;
    db.query(sql, [studentId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Save entry test result
const saveEntryTestResult = (resultData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO entry_test_results SET ?";
    db.query(sql, resultData, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Create test
const createTest = (testData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO testcreation SET ?";
    db.query(sql, testData, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get available questions
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

// Get all tests
const getAllTests = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT t.*, s.skill_name, d.level_name
      FROM testcreation t
      JOIN skills s ON t.skill_id = s.skill_id
      JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
    `;
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Get all students
const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT student_id, name FROM students";
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Assign test to students
const assignTest = (assignmentData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO testassigned (test_id, student_id, active_status) VALUES ?";
    const values = assignmentData.map((data) => [data.test_id, data.student_id, data.active_status || 0]);
    db.query(sql, [values], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Toggle test status for all students
// const toggleTestStatusForAll = (testId, activeStatus) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       UPDATE testassigned 
//       SET active_status = ? 
//       WHERE test_id = ?
//     `;
//     db.query(sql, [activeStatus, testId], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };



const toggleTestStatusForAll = (testId, activeStatus) => {
  return new Promise((resolve, reject) => {
    // Query to update testassigned table
    const testAssignedSql = `
      UPDATE testassigned 
      SET active_status = ? 
      WHERE test_id = ?
    `;
    // Query to update skilltests table
    const skillTestsSql = `
      UPDATE skilltests 
      SET active_status = ? 
      WHERE test_id = ?
    `;

    // Execute both queries concurrently
    Promise.all([
      new Promise((res, rej) => {
        db.query(testAssignedSql, [activeStatus, testId], (err, result) => {
          if (err) rej(err);
          else res(result);
        });
      }),
      new Promise((res, rej) => {
        db.query(skillTestsSql, [activeStatus, testId], (err, result) => {
          if (err) rej(err);
          else res(result);
        });
      }),
    ])
      .then(([testAssignedResult, skillTestsResult]) => {
        resolve({
          testAssignedAffected: testAssignedResult.affectedRows,
          skillTestsAffected: skillTestsResult.affectedRows,
        });
      })
      .catch((err) => reject(err));
  });
};





// Get assigned students for a test
const getAssignedStudents = (testId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT ta.student_id, s.name, ta.active_status
      FROM testassigned ta
      JOIN students s ON ta.student_id = s.student_id
      WHERE ta.test_id = ?
    `;
    db.query(sql, [testId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Get all available tests with questions for a student (assigned and skill-based)
// Get all available tests with questions for a student (assigned and skill-based)
const getAllTestsWithQuestions = async (studentId) => {
  return new Promise((resolve, reject) => {
    // Fetch assigned tests
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
    
    // Fetch skill-based tests based on student skills
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

    // Execute both queries concurrently
    Promise.all([
      new Promise((res, rej) => {
        db.query(sqlAssignedTests, [studentId], (err, results) => {
          if (err) rej(err);
          else res(results);
        });
      }),
      new Promise((res, rej) => {
        db.query(sqlSkillTests, [studentId], (err, results) => {
          if (err) rej(err);
          else res(results);
        });
      })
    ])
      .then(async ([assignedTests, skillTests]) => {
        const allTests = [...assignedTests, ...skillTests];
        const testsWithQuestions = [];

        const fetchQuestionsForLevel = async (difficultyId, count, skillId, excludeIds = []) => {
          // Filter out invalid excludeIds (null, undefined, non-numeric)
          const validExcludeIds = excludeIds
            .filter(id => id != null && !isNaN(id) && Number.isInteger(Number(id)))
            .map(Number);

          let sql = `
            SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
            FROM questions_mcq
            WHERE skill_id = ? AND difficulty_level_id = ?
          `;
          const params = [skillId, difficultyId];

          // Only add NOT IN clause if validExcludeIds is non-empty
          if (validExcludeIds.length > 0) {
            sql += ` AND id NOT IN (${validExcludeIds.map(() => "?").join(",")})`;
            params.push(...validExcludeIds);
          }

          sql += ` ORDER BY RAND() LIMIT ?`;
          params.push(count);

          // Log the query and parameters for debugging
          console.log("Executing query:", sql);
          console.log("Parameters:", params);

          return new Promise((res, rej) => {
            db.query(sql, params, (err, rows) => {
              if (err) {
                console.error("Query error:", err);
                rej(err);
              } else {
                res(rows);
              }
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
              const easyQuestions = await fetchQuestionsForLevel(1, easy_level_question, skill_id, usedQuestionIds);
              if (easyQuestions.length < easy_level_question) {
                throw new Error(`Please add ${easy_level_question - easyQuestions.length} more Easy questions for test ${test_name} (ID: ${test_id}). Only ${easyQuestions.length} available.`);
              }
              primaryQuestions.easy = easyQuestions;
              usedQuestionIds = [...usedQuestionIds, ...easyQuestions.map((q) => q.id)];
            }

            if (difficulty_level_id >= 2 && medium_level_question > 0) {
              const mediumQuestions = await fetchQuestionsForLevel(2, medium_level_question, skill_id, usedQuestionIds);
              if (mediumQuestions.length < medium_level_question) {
                throw new Error(`Please add ${medium_level_question - mediumQuestions.length} more Medium questions for test ${test_name} (ID: ${test_id}). Only ${mediumQuestions.length} available.`);
              }
              primaryQuestions.medium = mediumQuestions;
              usedQuestionIds = [...usedQuestionIds, ...mediumQuestions.map((q) => q.id)];
            }

            if (difficulty_level_id === 3 && hard_level_question > 0) {
              const hardQuestions = await fetchQuestionsForLevel(3, hard_level_question, skill_id, usedQuestionIds);
              if (hardQuestions.length < hard_level_question) {
                throw new Error(`Please add ${hard_level_question - hardQuestions.length} more Hard questions for test ${test_name} (ID: ${test_id}). Only ${hardQuestions.length} available.`);
              }
              primaryQuestions.hard = hardQuestions;
              usedQuestionIds = [...usedQuestionIds, ...hardQuestions.map((q) => q.id)];
            }

            const parseQuestions = (questions) =>
              questions.map((q) => ({
                ...q,
                option: JSON.parse(q.option || '[]'),
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
            console.error(`Error processing questions for test ${test_id}:`, error.message);
            testsWithQuestions.push({
              ...test,
              primary_questions: { easy: [], medium: [], hard: [] },
              additional_questions: { easy: [], medium: [], hard: [] },
              error: error.message,
            });
          }
        }

        resolve(testsWithQuestions);
      })
      .catch((err) => {
        console.error("Error fetching tests:", err);
        reject(err);
      });
  });
};

// Save test result (for both assigned and skill-based tests)
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

// Get questions by skill and difficulty level
const getQuestionsBySkillAndLevel = (skillId, levelId, count = 10, excludeIds = []) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
      FROM questions_mcq
      WHERE skill_id = ? AND difficulty_level_id = ?
    `;
    const params = [skillId, levelId];
    if (excludeIds.length > 0) {
      sql += ` AND id NOT IN (${excludeIds.map(() => "?").join(",")})`;
      params.push(...excludeIds);
    }
    sql += ` ORDER BY RAND() LIMIT ?`;
    params.push(count);
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


// Save a test schedule for a student
const saveTestSchedule = (student_id, test_id, datetime) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO test_schedules (student_id, test_id, datetime)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE datetime = ?, created_at = CURRENT_TIMESTAMP
    `;
    db.query(sql, [student_id, test_id, datetime, datetime], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get test schedules for a student
const getTestSchedules = (student_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT test_id, datetime
      FROM test_schedules
      WHERE student_id = ?
    `;
    db.query(sql, [student_id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};



const getStudentTestResults = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT test_id
      FROM testresults
      WHERE student_id = ?
    `;
    db.query(sql, [studentId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


// Start a test attempt
const startTest = (studentId, testId, testType) => {
  return new Promise((resolve, reject) => {
    // Check for existing active attempt
    const checkSql = `
      SELECT * FROM test_attempts 
      WHERE student_id = ? AND test_id = ? AND test_type = ? AND completed = FALSE
    `;
    db.query(checkSql, [studentId, testId, testType], (err, results) => {
      if (err) return reject(err);

      if (results.length > 0) {
        // Existing attempt found
        const attempt = results[0];
        const startTime = new Date(attempt.start_time);
        const durationMs = attempt.duration_minutes * 60 * 1000;
        const endTime = new Date(startTime.getTime() + durationMs);
        const now = new Date();
        const timeLeftMs = endTime - now;
        const timeLeftSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));

        return resolve({
          attempt_id: attempt.id,
          time_left_seconds: timeLeftSeconds,
          start_time: startTime,
        });
      }

      // Create new attempt
      const startTime = new Date();
      const insertSql = `
        INSERT INTO test_attempts (student_id, test_id, test_type, start_time, duration_minutes)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [studentId, testId, testType, startTime, 30], (err, result) => {
        if (err) return reject(err);
        resolve({
          attempt_id: result.insertId,
          time_left_seconds: 30 * 60, // 30 minutes in seconds
          start_time: startTime,
        });
      });
    });
  });
};

// Get remaining time for a test attempt
const getTestTime = (attemptId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT start_time, duration_minutes, completed 
      FROM test_attempts 
      WHERE id = ?
    `;
    db.query(sql, [attemptId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error("Test attempt not found"));

      const attempt = results[0];
      if (attempt.completed) return resolve(0);

      const startTime = new Date(attempt.start_time);
      const durationMs = attempt.duration_minutes * 60 * 1000;
      const endTime = new Date(startTime.getTime() + durationMs);
      const now = new Date();
      const timeLeftMs = endTime - now;
      const timeLeftSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));

      resolve(timeLeftSeconds);
    });
  });
};

// Mark test attempt as completed
const completeTestAttempt = (attemptId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE test_attempts 
      SET completed = TRUE 
      WHERE id = ?
    `;
    db.query(sql, [attemptId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};



// Get all transactions with student and project details
const getAllTransactions = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        pd.from_account_number,
        pd.to_account_number,
        pd.transaction_id,
        pd.transaction_screenshot,
        s.name AS student_name,
        p.project_name
      FROM payment_details pd
      JOIN students s ON pd.student_id = s.student_id
      JOIN projects p ON pd.project_id = p.project_id
    `;
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


// Check payment status by student_id and project_id
const checkPaymentStatus = (studentId, projectId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT payment_id, student_id, project_id, from_account_number, to_account_number, transaction_id, transaction_screenshot,created_at
      FROM payment_details
      WHERE student_id = ? AND project_id = ?
    `;
    db.query(sql, [studentId, projectId], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
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
  toggleTestStatusForAll,
  getAssignedStudents,
  getAllTestsWithQuestions,
  saveTestResult,
  getQuestionsBySkillAndLevel,
  saveTestSchedule,
  getTestSchedules,
  getActiveSkills,
  getStudentTestResults,
  startTest,
  getTestTime,
  completeTestAttempt,
  getAllTransactions, // New export

checkPaymentStatus, // New export

};