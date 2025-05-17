// import db from "../config/db.js";

// // Create skill
// const createSkill = (skillData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "INSERT INTO skills SET ?";
//     db.query(sql, skillData, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Create multiple skills
// const createMultipleSkills = (skills) => {
//   return new Promise((resolve, reject) => {
//     const sql = "INSERT INTO skills (skill_name) VALUES ?";
//     const values = skills.map((skill) => [skill.skill_name]);
//     db.query(sql, [values], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Get all skills
// const getAllSkills = () => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT * FROM skills";
//     db.query(sql, (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Get skill by ID
// const getSkillById = (skillId) => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT * FROM skills WHERE skill_id = ?";
//     db.query(sql, [skillId], (err, result) => {
//       if (err) reject(err);
//       else resolve(result[0]);
//     });
//   });
// };

// // Update skill
// const updateSkill = (skillId, skillData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "UPDATE skills SET ? WHERE skill_id = ?";
//     db.query(sql, [skillData, skillId], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Delete skill
// const deleteSkill = (skillId) => {
//   return new Promise((resolve, reject) => {
//     const sql = "DELETE FROM skills WHERE skill_id = ?";
//     db.query(sql, [skillId], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Create difficulty level
// const createLevel = (levelData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "INSERT INTO difficultylevels SET ?";
//     db.query(sql, levelData, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Create multiple difficulty levels
// const createMultipleLevels = (levels) => {
//   return new Promise((resolve, reject) => {
//     const sql = "INSERT INTO difficultylevels (level_name) VALUES ?";
//     const values = levels.map((level) => [level.level_name]);
//     db.query(sql, [values], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Get all difficulty levels
// const getAllLevels = () => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT * FROM difficultylevels";
//     db.query(sql, (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Get difficulty level by ID
// const getLevelById = (levelId) => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT * FROM difficultylevels WHERE level_id = ?";
//     db.query(sql, [levelId], (err, result) => {
//       if (err) reject(err);
//       else resolve(result[0]);
//     });
//   });
// };

// // Update difficulty level
// const updateLevel = (levelId, levelData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "UPDATE difficultylevels SET ? WHERE level_id = ?";
//     db.query(sql, [levelData, levelId], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Delete difficulty level
// const deleteLevel = (levelId) => {
//   return new Promise((resolve, reject) => {
//     const sql = "DELETE FROM difficultylevels WHERE level_id = ?";
//     db.query(sql, [levelId], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Create MCQ
// const createMCQ = (mcqData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "INSERT INTO questions_mcq SET ?";
//     db.query(sql, mcqData, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Get all MCQs
// const getAllMcqs = () => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT q.*, s.skill_name, d.level_name
//       FROM questions_mcq q
//       JOIN skills s ON q.skill_id = s.skill_id
//       JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
//     `;
//     db.query(sql, (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Get MCQ by ID
// const getMcqById = (id) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT q.*, s.skill_name, d.level_name
//       FROM questions_mcq q
//       JOIN skills s ON q.skill_id = s.skill_id
//       JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
//       WHERE q.id = ?
//     `;
//     db.query(sql, [id], (err, result) => {
//       if (err) reject(err);
//       else resolve(result[0]);
//     });
//   });
// };

// // Update MCQ
// const updateMcq = (id, mcqData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "UPDATE questions_mcq SET ? WHERE id = ?";
//     db.query(sql, [mcqData, id], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Delete MCQ
// const deleteMcq = (id) => {
//   return new Promise((resolve, reject) => {
//     const sql = "DELETE FROM questions_mcq WHERE id = ?";
//     db.query(sql, [id], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Get MCQs by student skills
// const getMcqsByStudentSkills = (studentId) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT q.*, s.skill_name, d.level_name
//       FROM questions_mcq q
//       JOIN skills s ON q.skill_id = s.skill_id
//       JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
//       JOIN student_skills ss ON q.skill_id = ss.skill_id
//       WHERE ss.student_id = ?
//       ORDER BY q.skill_id, q.difficulty_level_id
//     `;
//     db.query(sql, [studentId], (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Get entry test questions by student skills
// const getEntryTestQuestionsByStudentSkills = (studentId, limit = 10) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT q.*, s.skill_name, d.level_name
//       FROM questions_mcq q
//       JOIN skills s ON q.skill_id = s.skill_id
//       JOIN difficultylevels d ON q.difficulty_level_id = d.level_id
//       JOIN student_skills ss ON q.skill_id = ss.skill_id
//       WHERE ss.student_id = ?
//       ORDER BY RAND()
//       LIMIT ?
//     `;
//     db.query(sql, [studentId, limit], (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Create quiz attempt
// const createQuizAttempt = (attemptData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "INSERT INTO quiz_attempts SET ?";
//     db.query(sql, attemptData, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Get quiz attempts by student ID
// const getQuizAttemptsByStudentId = (studentId) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT qa.*, s.skill_name, d.level_name
//       FROM quiz_attempts qa
//       JOIN skills s ON qa.skill_id = s.skill_id
//       JOIN difficultylevels d ON qa.difficulty_level_id = d.level_id
//       WHERE qa.student_id = ?
//       ORDER BY qa.attempted_at DESC
//     `;
//     db.query(sql, [studentId], (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Save entry test result
// const saveEntryTestResult = (resultData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "INSERT INTO entry_test_results SET ?";
//     db.query(sql, resultData, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Create test
// const createTest = (testData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "INSERT INTO testcreation SET ?";
//     db.query(sql, testData, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Get available questions
// const getAvailableQuestions = (skillId, levelId) => {
//   return new Promise((resolve, reject) => {
//     let sql = `
//       SELECT id, questions, \`option\`, correct_answer, skill_id, difficulty_level_id
//       FROM questions_mcq
//       WHERE 1=1
//     `;
//     const params = [];
//     if (skillId) {
//       sql += " AND skill_id = ?";
//       params.push(skillId);
//     }
//     if (levelId) {
//       sql += " AND difficulty_level_id = ?";
//       params.push(levelId);
//     }
//     sql += " ORDER BY RAND()";
//     db.query(sql, params, (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Get all tests
// const getAllTests = () => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT t.*, s.skill_name, d.level_name
//       FROM testcreation t
//       JOIN skills s ON t.skill_id = s.skill_id
//       JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
//     `;
//     db.query(sql, (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Get all students
// const getAllStudents = () => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT student_id, name FROM students";
//     db.query(sql, (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Assign test to students
// const assignTest = (assignmentData) => {
//   return new Promise((resolve, reject) => {
//     const sql = "INSERT INTO testassigned (test_id, student_id, active_status) VALUES ?";
//     const values = assignmentData.map((data) => [data.test_id, data.student_id, data.active_status || 0]);
//     db.query(sql, [values], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// // Toggle test status for all students
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

// // Get assigned students for a test
// const getAssignedStudents = (testId) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT ta.student_id, s.name, ta.active_status
//       FROM testassigned ta
//       JOIN students s ON ta.student_id = s.student_id
//       WHERE ta.test_id = ?
//     `;
//     db.query(sql, [testId], (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Get assigned tests with questions for a student
// const getAssignedTestsWithQuestions = (studentId) => {
//   return new Promise((resolve, reject) => {
//     const sqlTests = `
//       SELECT 
//         t.test_id,
//         t.test_name,
//         t.test_description,
//         t.skill_id,
//         t.difficulty_level_id,
//         t.easy_level_question,
//         t.medium_level_question,
//         t.hard_level_question,
//         t.total_no_of_questions,
//         t.easy_pass_mark,
//         t.medium_pass_mark,
//         t.hard_pass_mark,
//         t.created_at,
//         s.skill_name,
//         d.level_name
//       FROM testcreation t
//       JOIN skills s ON t.skill_id = s.skill_id
//       JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
//       JOIN testassigned ta ON t.test_id = ta.test_id
//       WHERE ta.student_id = ? AND ta.active_status = 1
//     `;
//     db.query(sqlTests, [studentId], async (err, tests) => {
//       if (err) {
//         console.error("Error fetching assigned tests:", err);
//         reject(err);
//         return;
//       }
//       const testsWithQuestions = [];
//       for (const test of tests) {
//         const {
//           skill_id,
//           easy_level_question,
//           medium_level_question,
//           hard_level_question,
//           total_no_of_questions,
//           difficulty_level_id,
//         } = test;
//         const fetchQuestionsForLevel = async (difficultyId, count, excludeIds = []) => {
//           let sql = `
//             SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
//             FROM questions_mcq
//             WHERE skill_id = ? AND difficulty_level_id = ?
//           `;
//           const params = [skill_id, difficultyId];
//           if (excludeIds.length > 0) {
//             sql += ` AND id NOT IN (${excludeIds.map(() => "?").join(",")})`;
//             params.push(...excludeIds);
//           }
//           sql += ` ORDER BY RAND() LIMIT ?`;
//           params.push(count);
//           return new Promise((res, rej) => {
//             db.query(sql, params, (err, rows) => {
//               if (err) rej(err);
//               else res(rows);
//             });
//           });
//         };
//         try {
//           const primaryQuestions = { easy: [], medium: [], hard: [] };
//           let usedQuestionIds = [];
//           if (difficulty_level_id >= 1 && easy_level_question > 0) {
//             const easyQuestions = await fetchQuestionsForLevel(1, easy_level_question);
//             if (easyQuestions.length < easy_level_question) {
//               throw new Error(`Please add ${easy_level_question - easyQuestions.length} more Easy questions for test ${test.test_name}. Only ${easyQuestions.length} available.`);
//             }
//             primaryQuestions.easy = easyQuestions;
//             usedQuestionIds.push(...easyQuestions.map((q) => q.id));
//           }
//           if (difficulty_level_id >= 2 && medium_level_question > 0) {
//             const mediumQuestions = await fetchQuestionsForLevel(2, medium_level_question, usedQuestionIds);
//             if (mediumQuestions.length < medium_level_question) {
//               throw new Error(`Please add ${medium_level_question - mediumQuestions.length} more Medium questions for test ${test.test_name}. Only ${mediumQuestions.length} available.`);
//             }
//             primaryQuestions.medium = mediumQuestions;
//             usedQuestionIds.push(...mediumQuestions.map((q) => q.id));
//           }
//           if (difficulty_level_id === 3 && hard_level_question > 0) {
//             const hardQuestions = await fetchQuestionsForLevel(3, hard_level_question, usedQuestionIds);
//             if (hardQuestions.length < hard_level_question) {
//               throw new Error(`Please add ${hard_level_question - hardQuestions.length} more Hard questions for test ${test.test_name}. Only ${hardQuestions.length} available.`);
//             }
//             primaryQuestions.hard = hardQuestions;
//             usedQuestionIds.push(...hardQuestions.map((q) => q.id));
//           }
//           const parseQuestions = (questions) =>
//             questions.map((q) => ({
//               ...q,
//               option: JSON.parse(q.option),
//             }));
//           testsWithQuestions.push({
//             ...test,
//             primary_questions: {
//               easy: parseQuestions(primaryQuestions.easy),
//               medium: parseQuestions(primaryQuestions.medium),
//               hard: parseQuestions(primaryQuestions.hard),
//             },
//             additional_questions: {
//               easy: [],
//               medium: [],
//               hard: [],
//             },
//           });
//         } catch (error) {
//           console.error(`Error processing questions for test ${test.test_id}:`, error.message);
//           reject(error);
//           return;
//         }
//       }
//       resolve(testsWithQuestions);
//     });
//   });
// };

// // Save test result (for both assigned and skill-based tests)
// const saveTestResult = async (resultData) => {
//   return new Promise((resolve, reject) => {
//     const {
//       test_id,
//       student_id,
//       easy_score,
//       medium_score,
//       hard_score,
//       total_score,
//       incorrect_answer_count,
//       student_level,
//       percentage,
//     } = resultData;
//     const sql = `
//       INSERT INTO testresults (
//         test_id, student_id, easy_score, medium_score, hard_score,
//         total_score, incorrect_answer_count, student_level, percentage, attend_at
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
//     `;
//     db.query(
//       sql,
//       [
//         test_id,
//         student_id,
//         easy_score,
//         medium_score,
//         hard_score,
//         total_score,
//         incorrect_answer_count,
//         student_level,
//         percentage,
//       ],
//       (err, result) => {
//         if (err) reject(err);
//         else resolve(result);
//       }
//     );
//   });
// };

// // Get questions by skill and difficulty level
// const getQuestionsBySkillAndLevel = (skillId, levelId, count = 10, excludeIds = []) => {
//   return new Promise((resolve, reject) => {
//     let sql = `
//       SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
//       FROM questions_mcq
//       WHERE skill_id = ? AND difficulty_level_id = ?
//     `;
//     const params = [skillId, levelId];
//     if (excludeIds.length > 0) {
//       sql += ` AND id NOT IN (${excludeIds.map(() => "?").join(",")})`;
//       params.push(...excludeIds);
//     }
//     sql += ` ORDER BY RAND() LIMIT ?`;
//     params.push(count);
//     db.query(sql, params, (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // Get skill-based tests with questions for a student
// const getSkillBasedTestsWithQuestions = async (studentId) => {
//   return new Promise((resolve, reject) => {
//     const sqlTests = `
//       SELECT 
//         t.test_id,
//         t.test_name,
//         t.test_description,
//         t.skill_id,
//         t.difficulty_level_id,
//         t.easy_level_question,
//         t.medium_level_question,
//         t.hard_level_question,
//         t.total_no_of_questions,
//         t.easy_pass_mark,
//         t.medium_pass_mark,
//         t.hard_pass_mark,
//         t.created_at,
//         s.skill_name,
//         d.level_name
//       FROM testcreation t
//       JOIN skills s ON t.skill_id = s.skill_id
//       JOIN difficultylevels d ON t.difficulty_level_id = d.level_id
//       JOIN student_skills ss ON t.skill_id = ss.skill_id
//       WHERE ss.student_id = ?
//     `;
//     db.query(sqlTests, [studentId], async (err, tests) => {
//       if (err) {
//         console.error("Error fetching skill-based tests:", err);
//         reject(err);
//         return;
//       }
//       const testsWithQuestions = [];
//       for (const test of tests) {
//         const {
//           skill_id,
//           easy_level_question,
//           medium_level_question,
//           hard_level_question,
//           total_no_of_questions,
//           difficulty_level_id,
//         } = test;
//         const fetchQuestionsForLevel = async (difficultyId, count, excludeIds = []) => {
//           let sql = `
//             SELECT id, questions, \`option\`, correct_answer, difficulty_level_id
//             FROM questions_mcq
//             WHERE skill_id = ? AND difficulty_level_id = ?
//           `;
//           const params = [skill_id, difficultyId];
//           if (excludeIds.length > 0) {
//             sql += ` AND id NOT IN (${excludeIds.map(() => "?").join(",")})`;
//             params.push(...excludeIds);
//           }
//           sql += ` ORDER BY RAND() LIMIT ?`;
//           params.push(count);
//           return new Promise((res, rej) => {
//             db.query(sql, params, (err, rows) => {
//               if (err) rej(err);
//               else res(rows);
//             });
//           });
//         };
//         try {
//           const primaryQuestions = { easy: [], medium: [], hard: [] };
//           let usedQuestionIds = [];
//           if (difficulty_level_id >= 1 && easy_level_question > 0) {
//             const easyQuestions = await fetchQuestionsForLevel(1, easy_level_question);
//             if (easyQuestions.length < easy_level_question) {
//               throw new Error(`Please add ${easy_level_question - easyQuestions.length} more Easy questions for test ${test.test_name}. Only ${easyQuestions.length} available.`);
//             }
//             primaryQuestions.easy = easyQuestions;
//             usedQuestionIds.push(...easyQuestions.map((q) => q.id));
//           }
//           if (difficulty_level_id >= 2 && medium_level_question > 0) {
//             const mediumQuestions = await fetchQuestionsForLevel(2, medium_level_question, usedQuestionIds);
//             if (mediumQuestions.length < medium_level_question) {
//               throw new Error(`Please add ${medium_level_question - mediumQuestions.length} more Medium questions for test ${test.test_name}. Only ${mediumQuestions.length} available.`);
//             }
//             primaryQuestions.medium = mediumQuestions;
//             usedQuestionIds.push(...mediumQuestions.map((q) => q.id));
//           }
//           if (difficulty_level_id === 3 && hard_level_question > 0) {
//             const hardQuestions = await fetchQuestionsForLevel(3, hard_level_question, usedQuestionIds);
//             if (hardQuestions.length < hard_level_question) {
//               throw new Error(`Please add ${hard_level_question - hardQuestions.length} more Hard questions for test ${test.test_name}. Only ${hardQuestions.length} available.`);
//             }
//             primaryQuestions.hard = hardQuestions;
//             usedQuestionIds.push(...hardQuestions.map((q) => q.id));
//           }
//           const parseQuestions = (questions) =>
//             questions.map((q) => ({
//               ...q,
//               option: JSON.parse(q.option),
//             }));
//           testsWithQuestions.push({
//             ...test,
//             primary_questions: {
//               easy: parseQuestions(primaryQuestions.easy),
//               medium: parseQuestions(primaryQuestions.medium),
//               hard: parseQuestions(primaryQuestions.hard),
//             },
//             additional_questions: {
//               easy: [],
//               medium: [],
//               hard: [],
//             },
//           });
//         } catch (error) {
//           console.error(`Error processing questions for test ${test.test_id}:`, error.message);
//           reject(error);
//           return;
//         }
//       }
//       resolve(testsWithQuestions);
//     });
//   });
// };

// export default {
//   createSkill,
//   createMultipleSkills,
//   getAllSkills,
//   getSkillById,
//   updateSkill,
//   deleteSkill,
//   createLevel,
//   createMultipleLevels,
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
//   getEntryTestQuestionsByStudentSkills,
//   createQuizAttempt,
//   getQuizAttemptsByStudentId,
//   saveEntryTestResult,
//   createTest,
//   getAvailableQuestions,
//   getAllTests,
//   getAllStudents,
//   assignTest,
//   toggleTestStatusForAll,
//   getAssignedStudents,
//   getAssignedTestsWithQuestions,
//   saveTestResult,
//   getQuestionsBySkillAndLevel,
//   getSkillBasedTestsWithQuestions,
// };













































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
const getAvailableQuestions = (skillId, levelId) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT id, questions, \`option\`, correct_answer, skill_id, difficulty_level_id
      FROM questions_mcq
      WHERE 1=1
    `;
    const params = [];
    if (skillId) {
      sql += " AND skill_id = ?";
      params.push(skillId);
    }
    if (levelId) {
      sql += " AND difficulty_level_id = ?";
      params.push(levelId);
    }
    sql += " ORDER BY RAND()";
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
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
const toggleTestStatusForAll = (testId, activeStatus) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE testassigned 
      SET active_status = ? 
      WHERE test_id = ?
    `;
    db.query(sql, [activeStatus, testId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
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
};