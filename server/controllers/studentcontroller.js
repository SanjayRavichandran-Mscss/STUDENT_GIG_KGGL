// import db from "../config/db.js";
// import path from "path";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// import { promisify } from "util";

// // Promisify db.query for async/await
// const dbQuery = promisify(db.query).bind(db);

// // Student Registration
// const StudentRegistration = async (req, res) => {
//   let {
//     name,
//     email,
//     password,
//     selectedCategory,
//     selectedCollege,
//     year,
//     skill,
//     role_id,
//   } = req.body;

//   try {
//     // Check if email already exists
//     const checkEmailQuery = "SELECT COUNT(*) AS count FROM students WHERE email = ?";
//     const emailResult = await dbQuery(checkEmailQuery, [email]);

//     if (emailResult[0].count > 0) {
//       return res.status(200).send("Email already exists");
//     }

//     // Validate role_id exists in role table
//     const checkRoleQuery = "SELECT role_id FROM role WHERE role_id = ?";
//     const roleResult = await dbQuery(checkRoleQuery, [role_id]);

//     if (roleResult.length === 0) {
//       return res.status(400).json({ status: "error", message: "Invalid role selected" });
//     }

//     // Insert student into students table
//     const registrationSql =
//       "INSERT INTO students(name, email, password, degree, year, specialization, college_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//     await dbQuery(registrationSql, [
//       name,
//       email,
//       password, // Store password as plain text
//       selectedCollege, // degree (course_id)
//       year,
//       skill,
//       selectedCategory, // college_id
//       role_id,
//     ]);

//     res.json({ status: "inserted" });
//   } catch (error) {
//     console.error("Error in StudentRegistration:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Student Login
// const StudentLogin = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ status: "both_are_invalid", message: "Email and password are required" });
//   }

//   try {
//     // Check if JWT_SECRET is defined
//     if (!process.env.JWT_SECRET) {
//       throw new Error("JWT_SECRET is not defined in environment variables");
//     }

//     const loginSql = "SELECT * FROM students WHERE email = ?";
//     const result = await dbQuery(loginSql, [email]);

//     if (result.length === 0) {
//       return res.json({ status: "both_are_invalid", msg: "Please check your username" });
//     }

//     const user = result[0];
//     const isMatch = password === user.password; // Compare plain text passwords

//     if (!isMatch) {
//       return res.json({ status: "invalid_user", msg: "Please check your password" });
//     }

//     const token = jwt.sign({ user: user.student_id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.cookie("accessToken", token, { httpOnly: true, sameSite: "strict" });
//     res.json({
//       status: "user",
//       id: user.student_id,
//       role: user.role_id,
//       name: user.name,
//     });
//   } catch (error) {
//     console.error("Error in StudentLogin:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Role-Based Authentication Middleware
// const restrictTo = (roles) => {
//   return async (req, res, next) => {
//     try {
//       const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
//       if (!token) {
//         return res.status(401).json({ status: "error", message: "No token provided" });
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = decoded.user;

//       const userQuery = "SELECT role_id FROM students WHERE student_id = ?";
//       const userResult = await dbQuery(userQuery, [userId]);

//       if (!userResult.length) {
//         return res.status(404).json({ status: "error", message: "User not found" });
//       }

//       const userRole = userResult[0].role_id;

//       if (!roles.includes(userRole)) {
//         return res.status(403).json({ status: "error", message: "Access denied" });
//       }

//       req.user = { id: userId, role_id: userRole };
//       next();
//     } catch (error) {
//       console.error("Auth Error:", error);
//       res.status(401).json({ status: "error", message: "Invalid token" });
//     }
//   };
// };

// // Admin Dashboard (Example Protected Route)
// const adminDashboard = async (req, res) => {
//   res.json({ message: "Welcome to Admin Dashboard", user: req.user });
// };

// // Get Single Student Data
// const GetSingleStudentData = async (req, res) => {
//   const { student_id } = req.params;

//   try {
//     const getData = "SELECT * FROM students WHERE student_id = ?";
//     const result = await dbQuery(getData, [student_id]);
//     res.json({ status: true, msg: result });
//   } catch (error) {
//     console.error("Error in GetSingleStudentData:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Profile Updation
// const profileUpdation = async (req, res) => {
//   const { id, git, des, url, skill } = req.body;
//   const file = req.file;

//   try {
//     const sqlUpdateStudent = "UPDATE students SET github_link = ? WHERE student_id = ?";
//     await dbQuery(sqlUpdateStudent, [git, id]);

//     const sqlCheckSkill = "SELECT * FROM student_skills WHERE student_id = ? AND skill_id = ?";
//     const skillResult = await dbQuery(sqlCheckSkill, [id, skill]);

//     if (skillResult.length > 0) {
//       return res.status(400).send("Skill_already_exists_for_this_student");
//     }

//     const sqlInsertSkill =
//       "INSERT INTO student_skills(student_id, skill_id, skill_url, skill_description) VALUES (?, ?, ?, ?)";
//     await dbQuery(sqlInsertSkill, [id, skill, url, des]);

//     res.status(200).send("Profile updated successfully");
//   } catch (error) {
//     console.error("Error in profileUpdation:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Update User Data
// const updateUserData = async (req, res) => {
//   const { Name, Email, Password, Degree, Year, Spl, coll, id } = req.body;
//   let Filename = null;

//   try {
//     if (req.file) {
//       Filename = req.file.filename;
//     }

//     let sql =
//       "UPDATE students SET name = ?, email = ?, password = ?, degree = ?, year = ?, specialization = ?, college_id = ?";
//     let values = [Name, Email, Password, Degree, Year, Spl, coll];

//     if (Filename) {
//       sql += ", profile_photo = ?";
//       values.push(Filename);
//     }

//     sql += " WHERE student_id = ?";
//     values.push(id);

//     await dbQuery(sql, values);
//     res.json({ status: true, msg: "updated" });
//   } catch (error) {
//     console.error("Error in updateUserData:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Get Single Profile
// const getSingleProfile = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const sql = "SELECT * FROM students WHERE student_id = ?";
//     const result = await dbQuery(sql, [id]);
//     res.json({ result });
//   } catch (error) {
//     console.error("Error in getSingleProfile:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Get Student Skills
// const getStudentSkills = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const sql = `
//       SELECT s.skill_name
//       FROM skills s
//       JOIN student_skills ss ON s.skill_id = ss.skill_id
//       WHERE ss.student_id = ?`;
//     const result = await dbQuery(sql, [id]);
//     res.send(result);
//   } catch (error) {
//     console.error("Error in getStudentSkills:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Forgot Password
// const ForgotPassword = async (req, res) => {
//   const { Email } = req.body;

//   try {
//     const sql = `SELECT * FROM students WHERE email = ?`;
//     const result = await dbQuery(sql, [Email]);

//     if (result.length === 0) {
//       return res.status(404).json({ status: "error", message: "User not found" });
//     }

//     const id = result[0].student_id;
//     const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5m" });

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "sivaranji5670@gmail.com",
//         pass: "zicd vrfo zxbs jsfb",
//       },
//     });

//     const text = `http://localhost:3000/reset/${token}`;
//     const mailOptions = {
//       from: "sivaranji5670@gmail.com",
//       to: Email,
//       subject: "Regarding Reset Password",
//       html: `<h1>Reset Password Link</h1>
//              <p>Password reset refers to the process of changing or recovering a forgotten password for a user account in an organization's system</p>
//              <h2>${text}</h2>`,
//     };

//     await transporter.sendMail(mailOptions);
//     res.send("mail_sended");
//   } catch (error) {
//     console.error("Error in ForgotPassword:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Reset Password
// const ResetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { Password } = req.body;

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = verified.id;

//     const sql = `UPDATE students SET password = ? WHERE student_id = ?`;
//     await dbQuery(sql, [Password, userId]); // Store password as plain text

//     res.send("password_updated");
//   } catch (error) {
//     console.error("Error in ResetPassword:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Student Project Details
// const StudentProjectDetails = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const sql = `
//       SELECT 
//         p.project_id, 
//         p.project_name, 
//         p.description AS project_description, 
//         p.status_id, 
//         p.created_at, 
//         p.expiry_date,
//         s.skill_id, 
//         s.skill_name
//       FROM 
//         projects p
//       LEFT JOIN 
//         skills s ON p.stack = s.skill_id
//       WHERE 
//         p.project_id = ?`;
//     const result = await dbQuery(sql, [id]);
//     res.send(result);
//   } catch (error) {
//     console.error("Error in StudentProjectDetails:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Quiz Results
// const QuizzResults = async (req, res) => {
//   try {
//     const { student_name, totalScore, quiz_attempts, questions, student_id } = req.body;

//     await dbQuery(
//       `UPDATE students SET quiz_attempts = quiz_attempts + ? WHERE student_id = ?`,
//       [quiz_attempts, student_id]
//     );

//     let easyScore = 0;
//     let mediumScore = 0;
//     let hardScore = 0;

//     questions.forEach((q) => {
//       if (q.difficulty_level_id === 1 && q.is_correct) easyScore++;
//       else if (q.difficulty_level_id === 2 && q.is_correct) mediumScore++;
//       else if (q.difficulty_level_id === 3 && q.is_correct) hardScore++;
//     });

//     const quizResult = await dbQuery(
//       `INSERT INTO quizattempts (student_id, quiz_score) VALUES (?, ?)`,
//       [student_id, totalScore]
//     );

//     const attempt_id = quizResult.insertId;
//     const questionAttempts = questions.map((q) => [
//       student_id,
//       q.question_id,
//       q.chosen_option,
//       q.is_correct,
//       1,
//       attempt_id,
//     ]);

//     await dbQuery(
//       `INSERT INTO studentquestionattempts (student_id, question_id, chosen_option, is_correct, encounter_count, attempt_id) VALUES ?`,
//       [questionAttempts]
//     );

//     res.json({ message: "Quiz data submitted successfully", totalScore });
//   } catch (error) {
//     console.error("Error in QuizzResults:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Student Difficulty Questions
// const studentDifficulty = async (req, res) => {
//   const level = req.query.level;

//   try {
//     const result = await dbQuery(
//       "SELECT question_id, question_text, difficulty_level_id, options, correct_answer FROM questions WHERE difficulty_level_id = ? LIMIT 10",
//       [level]
//     );
//     res.json(result);
//   } catch (error) {
//     console.error("Error in studentDifficulty:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Student Option Click
// const studentOptionClick = async (req, res) => {
//   try {
//     const { questionId, selectedOption } = req.body;

//     const query = "SELECT correct_answer, difficulty_level_id FROM questions WHERE question_id = ?";
//     const result = await dbQuery(query, [questionId]);

//     if (result.length === 0) {
//       return res.status(404).json({ status: "error", message: "Question not found" });
//     }

//     const { correct_answer, difficulty_level_id } = result[0];
//     const isCorrect = selectedOption === correct_answer;
//     const difficultyLevel = difficulty_level_id; // Fixed typo

//     res.json({ isCorrect, difficultyLevel });
//   } catch (error) {
//     console.error("Error in studentOptionClick:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// // Verify Authentication
// const Verify = async (req, res) => {
//   res.json({ status: true, msg: "authorized" });
// };

// // Logout
// const Logout = async (req, res) => {
//   try {
//     res.clearCookie("accessToken");
//     res.json({ status: true, msg: "logout" });
//   } catch (error) {
//     console.error("Error in Logout:", error);
//     res.status(500).json({ status: "error", message: "student_catch_error" });
//   }
// };

// export {
//   Logout,
//   Verify,
//   getSingleProfile,
//   updateUserData,
//   StudentRegistration,
//   StudentLogin,
//   GetSingleStudentData,
//   profileUpdation,
//   getStudentSkills,
//   ForgotPassword,
//   ResetPassword,
//   StudentProjectDetails,
//   QuizzResults,
//   studentDifficulty,
//   studentOptionClick,
//   restrictTo,
//   adminDashboard,
// };










import db from "../config/db.js";
import path from "path";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { promisify } from "util";

// Promisify db.query for async/await
const dbQuery = promisify(db.query).bind(db);

// Student Registration
const StudentRegistration = async (req, res) => {
  let {
    roll_no, // New roll_no field
    name,
    email,
    password,
    selectedCategory,
    selectedCollege,
    year,
    role_id,
  } = req.body;

  try {
    // Check if email already exists
    const checkEmailQuery = "SELECT COUNT(*) AS count FROM students WHERE email = ?";
    const emailResult = await dbQuery(checkEmailQuery, [email]);

    if (emailResult[0].count > 0) {
      return res.status(200).send("Email already exists");
    }

    // Validate role_id exists in role table
    const checkRoleQuery = "SELECT role_id FROM role WHERE role_id = ?";
    const roleResult = await dbQuery(checkRoleQuery, [role_id]);

    if (roleResult.length === 0) {
      return res.status(400).json({ status: "error", message: "Invalid role selected" });
    }

    // Insert student into students table
    const registrationSql =
      "INSERT INTO students(roll_no, name, email, password, degree, year, college_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    await dbQuery(registrationSql, [
      roll_no, // New roll_no
      name,
      email,
      password,
      selectedCollege, // degree (course_id)
      year,
      selectedCategory, // college_id
      role_id,
    ]);

    res.json({ status: "inserted" });
  } catch (error) {
    console.error("Error in StudentRegistration:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};


// Student Login
const StudentLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "both_are_invalid", message: "Email and password are required" });
  }

  try {
    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const loginSql = "SELECT * FROM students WHERE email = ?";
    const result = await dbQuery(loginSql, [email]);

    if (result.length === 0) {
      return res.json({ status: "both_are_invalid", msg: "Please check your username" });
    }

    const user = result[0];
    const isMatch = password === user.password; // Compare plain text passwords

    if (!isMatch) {
      return res.json({ status: "invalid_user", msg: "Please check your password" });
    }

    const token = jwt.sign({ user: user.student_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("accessToken", token, { 
      httpOnly: true, 
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Secure in production
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({
      status: "user",
      id: user.student_id,
      role: user.role_id,
      name: user.name,
    });
  } catch (error) {
    console.error("Error in StudentLogin:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Role-Based Authentication Middleware
const restrictTo = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ status: "error", message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user;

      const userQuery = "SELECT role_id FROM students WHERE student_id = ?";
      const userResult = await dbQuery(userQuery, [userId]);

      if (!userResult.length) {
        return res.status(404).json({ status: "error", message: "User not found" });
      }

      const userRole = userResult[0].role_id;

      if (!roles.includes(userRole)) {
        return res.status(403).json({ status: "error", message: "Access denied" });
      }

      req.user = { id: userId, role_id: userRole };
      next();
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(401).json({ status: "error", message: "Invalid token" });
    }
  };
};

// Admin Dashboard (Example Protected Route)
const adminDashboard = async (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
};

// Get Single Student Data
const GetSingleStudentData = async (req, res) => {
  const { student_id } = req.params;

  try {
    const getData = "SELECT * FROM students WHERE student_id = ?";
    const result = await dbQuery(getData, [student_id]);
    res.json({ status: true, msg: result });
  } catch (error) {
    console.error("Error in GetSingleStudentData:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Profile Updation
const profileUpdation = async (req, res) => {
  const { id, git, des, url, skill } = req.body;
  const file = req.file;

  try {
    const sqlUpdateStudent = "UPDATE students SET github_link = ? WHERE student_id = ?";
    await dbQuery(sqlUpdateStudent, [git, id]);

    const sqlCheckSkill = "SELECT * FROM student_skills WHERE student_id = ? AND skill_id = ?";
    const skillResult = await dbQuery(sqlCheckSkill, [id, skill]);

    if (skillResult.length > 0) {
      return res.status(400).send("Skill_already_exists_for_this_student");
    }

    const sqlInsertSkill =
      "INSERT INTO student_skills(student_id, skill_id, skill_url, skill_description) VALUES (?, ?, ?, ?)";
    await dbQuery(sqlInsertSkill, [id, skill, url, des]);

    res.status(200).send("Profile updated successfully");
  } catch (error) {
    console.error("Error in profileUpdation:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Update User Data
const updateUserData = async (req, res) => {
  const { Name, Email, Password, Degree, Year,  coll, id } = req.body;
  let Filename = null;

  try {
    if (req.file) {
      Filename = req.file.filename;
    }

    let sql =
      "UPDATE students SET name = ?, email = ?, password = ?, degree = ?, year = ?,college_id = ?";
    let values = [Name, Email, Password, Degree, Year, coll];

    if (Filename) {
      sql += ", profile_photo = ?";
      values.push(Filename);
    }

    sql += " WHERE student_id = ?";
    values.push(id);

    await dbQuery(sql, values);
    res.json({ status: true, msg: "updated" });
  } catch (error) {
    console.error("Error in updateUserData:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Get Single Profile
const getSingleProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "SELECT * FROM students WHERE student_id = ?";
    const result = await dbQuery(sql, [id]);
    res.json({ result });
  } catch (error) {
    console.error("Error in getSingleProfile:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Get Student Skills
const getStudentSkills = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT s.skill_name
      FROM skills s
      JOIN student_skills ss ON s.skill_id = ss.skill_id
      WHERE ss.student_id = ?`;
    const result = await dbQuery(sql, [id]);
    res.send(result);
  } catch (error) {
    console.error("Error in getStudentSkills:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Forgot Password
const ForgotPassword = async (req, res) => {
  const { Email } = req.body;

  try {
    const sql = `SELECT * FROM students WHERE email = ?`;
    const result = await dbQuery(sql, [Email]);

    if (result.length === 0) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const id = result[0].student_id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sivaranji5670@gmail.com",
        pass: "zicd vrfo zxbs jsfb",
      },
    });

    const text = `http://localhost:3000/reset/${token}`;
    const mailOptions = {
      from: "sivaranji5670@gmail.com",
      to: Email,
      subject: "Regarding Reset Password",
      html: `<h1>Reset Password Link</h1>
             <p>Password reset refers to the process of changing or recovering a forgotten password for a user account in an organization's system</p>
             <h2>${text}</h2>`,
    };

    await transporter.sendMail(mailOptions);
    res.send("mail_sended");
  } catch (error) {
    console.error("Error in ForgotPassword:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Reset Password
const ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { Password } = req.body;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const userId = verified.id;

    const sql = `UPDATE students SET password = ? WHERE student_id = ?`;
    await dbQuery(sql, [Password, userId]); // Store password as plain text

    res.send("password_updated");
  } catch (error) {
    console.error("Error in ResetPassword:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Student Project Details
const StudentProjectDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT 
        p.project_id, 
        p.project_name, 
        p.description AS project_description, 
        p.status_id, 
        p.created_at, 
        p.expiry_date,
        s.skill_id, 
        s.skill_name
      FROM 
        projects p
      LEFT JOIN 
        skills s ON p.stack = s.skill_id
      WHERE 
        p.project_id = ?`;
    const result = await dbQuery(sql, [id]);
    res.send(result);
  } catch (error) {
    console.error("Error in StudentProjectDetails:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Quiz Results
const QuizzResults = async (req, res) => {
  try {
    const { student_name, totalScore, quiz_attempts, questions, student_id } = req.body;

    await dbQuery(
      `UPDATE students SET quiz_attempts = quiz_attempts + ? WHERE student_id = ?`,
      [quiz_attempts, student_id]
    );

    let easyScore = 0;
    let mediumScore = 0;
    let hardScore = 0;

    questions.forEach((q) => {
      if (q.difficulty_level_id === 1 && q.is_correct) easyScore++;
      else if (q.difficulty_level_id === 2 && q.is_correct) mediumScore++;
      else if (q.difficulty_level_id === 3 && q.is_correct) hardScore++;
    });

    const quizResult = await dbQuery(
      `INSERT INTO quizattempts (student_id, quiz_score) VALUES (?, ?)`,
      [student_id, totalScore]
    );

    const attempt_id = quizResult.insertId;
    const questionAttempts = questions.map((q) => [
      student_id,
      q.question_id,
      q.chosen_option,
      q.is_correct,
      1,
      attempt_id,
    ]);

    await dbQuery(
      `INSERT INTO studentquestionattempts (student_id, question_id, chosen_option, is_correct, encounter_count, attempt_id) VALUES ?`,
      [questionAttempts]
    );

    res.json({ message: "Quiz data submitted successfully", totalScore });
  } catch (error) {
    console.error("Error in QuizzResults:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Student Difficulty Questions
const studentDifficulty = async (req, res) => {
  const level = req.query.level;

  try {
    const result = await dbQuery(
      "SELECT question_id, question_text, difficulty_level_id, options, correct_answer FROM questions WHERE difficulty_level_id = ? LIMIT 10",
      [level]
    );
    res.json(result);
  } catch (error) {
    console.error("Error in studentDifficulty:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Student Option Click
const studentOptionClick = async (req, res) => {
  try {
    const { questionId, selectedOption } = req.body;

    const query = "SELECT correct_answer, difficulty_level_id FROM questions WHERE question_id = ?";
    const result = await dbQuery(query, [questionId]);

    if (result.length === 0) {
      return res.status(404).json({ status: "error", message: "Question not found" });
    }

    const { correct_answer, difficulty_level_id } = result[0];
    const isCorrect = selectedOption === correct_answer;
    const difficultyLevel = difficulty_level_id;

    res.json({ isCorrect, difficultyLevel });
  } catch (error) {
    console.error("Error in studentOptionClick:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

// Verify Authentication
const Verify = async (req, res) => {
  res.json({ status: true, msg: "authorized" });
};

// Logout
const Logout = async (req, res) => {
  try {
    // Clear the accessToken cookie
    res.cookie("accessToken", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Secure in production
      expires: new Date(0), // Expire immediately
    });
    res.json({ status: true, msg: "logout" });
  } catch (error) {
    console.error("Error in Logout:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

export {
  Logout,
  Verify,
  getSingleProfile,
  updateUserData,
  StudentRegistration,
  StudentLogin,
  GetSingleStudentData,
  profileUpdation,
  getStudentSkills,
  ForgotPassword,
  ResetPassword,
  StudentProjectDetails,
  QuizzResults,
  studentDifficulty,
  studentOptionClick,
  restrictTo,
  adminDashboard,
};