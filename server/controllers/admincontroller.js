import db from "../config/db.js";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";

const studentsData = async (req, res) => {
  try {
    const sql = `SELECT * FROM students WHERE role_id=1`;

    db.query(sql, (err, result) => {
      if (err) {
        res.json({ msg: "db_error" });
      } else {
        res.json({ result });
      }
    });
  } catch (err) {
    res.json({ msg: "admin_error" });
  }
};


// const studentDetails = async (req, res) => {
//   try {
//     const sql = `
//       SELECT 
//         s.student_id,
//         s.roll_no,
//         s.name,
//         s.email,
//         s.profile_photo,
//         s.year,
//         s.resume_file,
//         s.github_link,
//         c.college_name,
//         co.course_name AS department,
//         GROUP_CONCAT(
//           JSON_OBJECT(
//             'skill_id', ss.skill_id,
//             'skill_name', sk.skill_name,
//             'skill_url', ss.skill_url,
//             'skill_description', ss.skill_description
//           )
//         ) AS skills
//       FROM students s
//       LEFT JOIN colleges c ON s.college_id = c.college_id
//       LEFT JOIN course co ON s.degree = co.course_id
//       LEFT JOIN student_skills ss ON s.student_id = ss.student_id
//       LEFT JOIN skills sk ON ss.skill_id = sk.skill_id
//       WHERE s.role_id = 2
//       GROUP BY s.student_id
//     `;

//     db.query(sql, (err, result) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res.status(500).json({ status: false, msg: "db_error" });
//       }

//       // Parse skills JSON strings into arrays
//       const parsedResult = result.map((row) => ({
//         ...row,
//         skills: row.skills ? JSON.parse(`[${row.skills}]`) : [],
//       }));

//       res.json({ status: true, result: parsedResult });
//     });
//   } catch (err) {
//     console.error("Server error:", err);
//     res.status(500).json({ status: false, msg: "admin_error" });
//   }
// };


const studentDetails = async (req, res) => {
  try {
    // First get all student basic info
    const studentsSql = `
      SELECT 
        s.student_id,
        s.roll_no,
        s.name,
        s.email,
        s.profile_photo,
        s.year,
        s.resume_file,
        s.github_link,
        c.college_name,
        co.course_name AS department
      FROM students s
      LEFT JOIN colleges c ON s.college_id = c.college_id
      LEFT JOIN course co ON s.degree = co.course_id
      WHERE s.role_id = 2
    `;

    // Then get all skills
    const skillsSql = `
      SELECT 
        ss.student_id,
        ss.skill_id,
        sk.skill_name,
        ss.skill_url,
        ss.skill_description
      FROM student_skills ss
      LEFT JOIN skills sk ON ss.skill_id = sk.skill_id
    `;

    const [students, skills] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(studentsSql, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(skillsSql, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      })
    ]);

    // Group skills by student_id
    const skillsByStudent = {};
    skills.forEach(skill => {
      if (!skillsByStudent[skill.student_id]) {
        skillsByStudent[skill.student_id] = [];
      }
      skillsByStudent[skill.student_id].push({
        skill_id: skill.skill_id,
        skill_name: skill.skill_name,
        skill_url: skill.skill_url,
        skill_description: skill.skill_description
      });
    });

    // Combine the data
    const result = students.map(student => ({
      ...student,
      skills: skillsByStudent[student.student_id] || []
    }));

    res.json({ status: true, result });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ status: false, msg: "admin_error" });
  }
};




const studentsCount = async (req, res) => {
  try {
    const sql = `SELECT COUNT(*) AS total_students FROM students`;

    db.query(sql, (err, result) => {
      if (err) {
        res.json({ msg: "db_error" });
      } else {
        res.json({ result });
      }
    });
  } catch (err) {
    res.json({ msg: "admin_error" });
  }
};

const filterCollegeStduents = (req, res) => {
  try {
    const sql = `SELECT c.college_name as name, COUNT(s.student_id) AS value
    FROM students s
    JOIN colleges c ON s.college_id = c.college_id
    GROUP BY c.college_name`;

    db.query(sql, (err, result) => {
      if (err) {
        res.json({ status: false, msg: "db_error" });
      } else {
        res.json({ status: true, msg: result });
      }
    });
  } catch (err) {
    res.json({ msg: "admin_error" });
  }
};

const filterStudentSkills = async (req, res) => {
  try {
    const sql = `SELECT s.skill_name, COUNT(ss.student_id) AS num_students_with_skill
  FROM student_skills ss
  JOIN skills s ON ss.skill_id = s.skill_id
  GROUP BY s.skill_name`;

    db.query(sql, (err, result) => {
      if (err) {
        res.json({ msg: "db_error" });
      } else {
        res.json({ result });
      }
    });
  } catch (e) {
    res.json({ msg: "admin_error" });
  }
};

// const addProjects = async (req, res) => {
//   const { pname, pdes, skill, date } = req.body;

//   try {
//     const sql =
//       "insert into projects(project_name,description,stack,expiry_date,status_id)values(?,?,?,?,1)";

//     db.query(sql, [pname, pdes, skill, date], (err, result) => {
//       if (err) {
//         res.json({ msg: "db_error" });
//         console.log(err);
//       } else {
//         res.json({ msg: "added" });
//       }
//     });
//   } catch (e) {
//     res.send("admin_error");
//   }
// };



const addProjects = async (req, res) => {
  const { pname, pdes, skill, date, level_id } = req.body;

  try {
    // Validate required fields
    if (!pname || !pdes || !skill || !date || !level_id) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const sql =
      "INSERT INTO projects (project_name, description, stack, expiry_date, status_id, level_id) VALUES (?, ?, ?, ?, 1, ?)";

    db.query(sql, [pname, pdes, skill, date, level_id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ msg: "db_error" });
      }
      res.json({ msg: "added" });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ msg: "server_error" });
  }
};



const skillBasedProjects = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `SELECT p.project_id, p.project_name, p.description, p.expiry_date, p.created_at
  FROM projects p
  JOIN student_skills ss ON p.stack = ss.skill_id
  WHERE ss.student_id = ?`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        res.json({ msg: "db_error" });
      } else {
        res.json({ result });
      }
    });
  } catch (e) {
    res.send("admin_error");
  }
};

const studentBitInfo = async (req, res) => {
  const { stu_id, pro_id } = req.body;

  try {
    const sql = `INSERT INTO bit (student_id, project_id) VALUES(?,?)`;

    db.query(sql, [stu_id, pro_id], (err, result) => {
      if (err) {
        res.send("query_error");
      } else {
        res.send("bit_added");
      }
    });
  } catch (e) {
    res.send("admin_error");
  }
};

const getAllProjects = async (req, res) => {
  try {
    const sql = `SELECT 
  p.project_id,
  p.project_name,
  p.description,
  p.stack,
  p.created_at,
  p.expiry_date,
  COUNT(b.bit_id) AS bit_count
FROM 
  projects p
LEFT JOIN 
  bit b ON p.project_id = b.project_id
GROUP BY 
  p.project_id, p.project_name;`;

    db.query(sql, (err, result) => {
      if (err) {
        res.send("db_error");
      } else {
        res.send(result);
      }
    });
  } catch (e) {
    res.send("admin_error");
  }
};

const getBitInfo = async (req, res) => {
  try {
    const sql = `
      SELECT project_id, COUNT(*) AS count
      FROM bit
      WHERE bit_status_id IS NULL
      GROUP BY project_id
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        res.send("db_error");
      } else {
        res.send(result);
      }
    });
  } catch (e) {
    console.error("Server error:", e);
    res.send("admin_error");
  }
};

const bittedInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `
      SELECT 
        p.project_id,
        p.project_name,
        b.bit_id,
        b.student_id,
        s.roll_no,
        s.name AS student_name,
        s.email,
        s.college_id,
        c.college_name,
        b.datetime,
        b.bit_status_id,
        COALESCE(bs.bit_status_name, 'pending') AS bit_status_name
      FROM projects p
      JOIN bit b ON p.project_id = b.project_id
      JOIN students s ON b.student_id = s.student_id
      JOIN colleges c ON s.college_id = c.college_id
      LEFT JOIN bitstatuses bs ON b.bit_status_id = bs.bit_status_id
      WHERE p.project_id = ?
    `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        res.send("db_error");
      } else {
        res.send(result);
      }
    });
  } catch (e) {
    console.error("Server error:", e);
    res.send("admin_error");
  }
};

const acceptBitting = async (req, res) => {
  const { stuid, proid } = req.params;
  const { email } = req.body;

  try {
    const sql = `
      UPDATE bit
      SET bit_status_id = ?
      WHERE project_id = ? AND student_id = ?
    `;

    db.query(sql, [1, proid, stuid], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.send("db_error");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sivaranji5670@gmail.com",
          pass: "zicd vrfo zxbs jsfb",
        },
      });

      const mailOptions = {
        from: "sivaranji5670@gmail.com",
        to: email,
        subject: "Confirmation msg",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                  .header { text-align: center; padding: 10px 0; background-color: #007bff; color: #ffffff; }
                  .content { padding: 20px; }
                  .footer { text-align: center; padding: 10px 0; background-color: #f4f4f4; color: #333333; font-size: 12px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Request Confirmation</h1>
                  </div>
                  <div class="content">
                      <p>Dear User,</p>
                      <p>We are pleased to inform you that your request has been accepted by the admin.</p>
                      <p>You can now proceed with the next steps as outlined in the instructions provided.</p>
                      <p>If you have any questions or need further assistance, feel free to contact us.</p>
                      <p>Best regards,</p>
                      <p><strong>Your Company Name</strong></p>
                  </div>
                  <div class="footer">
                      <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                      <p>1234 Street Name, City, State, 12345</p>
                  </div>
              </div>
          </body>
          </html>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email error:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      const updateProjectSql = `
        UPDATE projects
        SET status_id = 2
        WHERE project_id = ?
        AND EXISTS (
          SELECT 1
          FROM bit
          WHERE project_id = ?
          AND bit_status_id = 1
        )
      `;

      db.query(updateProjectSql, [proid, proid], (err, result) => {
        if (err) {
          console.error("Project update error:", err);
          return res.send("project_update_error");
        }
        res.send("updated");
      });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.send("admin_error");
  }
};

const getAllStudentAndTestData = async (req, res) => {
  try {
    const sql = `
      SELECT 
        s.student_id,
        s.name,
        s.email,
        s.profile_photo,
        s.github_link,
        s.linkedin_link,
        s.resume_file,
        s.degree,
        s.year,
        s.college_id,
        s.quiz_attempts,
        s.roll_no,
        s.mobile_number,
        s.semester,
        s.role_id,
        s.credits,
        
        tr.id AS test_result_id,
        tr.test_id,
        tr.easy_score,
        tr.medium_score,
        tr.hard_score,
        tr.total_score,
        tr.incorrect_answer_count,
        tr.skipped_question_count,
        tr.attend_at,
        tr.student_level,
        tr.percentage,
        tr.easy_attend_question,
        tr.medium_attend_question,
        tr.hard_attend_question

      FROM students s
      LEFT JOIN testresults tr ON s.student_id = tr.student_id
      WHERE s.role_id = 2
      ORDER BY s.student_id, tr.attend_at DESC;
    `;

    // Assuming you're using a callback-based mysql connection (e.g., mysql2 or mysql)
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Optional: Structure the data grouped by student
      const studentsMap = {};

      results.forEach(row => {
        const studentId = row.student_id;
        if (!studentsMap[studentId]) {
          studentsMap[studentId] = {
            student_id: row.student_id,
            name: row.name,
            email: row.email,
            profile_photo: row.profile_photo,
            github_link: row.github_link,
            linkedin_link: row.linkedin_link,
            resume_file: row.resume_file,
            degree: row.degree,
            year: row.year,
            college_id: row.college_id,
            quiz_attempts: row.quiz_attempts,
            roll_no: row.roll_no,
            mobile_number: row.mobile_number,
            semester: row.semester,
            role_id: row.role_id,
            credits: row.credits,
            test_results: []
          };
        }

        if (row.test_result_id) {
          studentsMap[studentId].test_results.push({
            id: row.test_result_id,
            test_id: row.test_id,
            easy_score: row.easy_score,
            medium_score: row.medium_score,
            hard_score: row.hard_score,
            total_score: row.total_score,
            incorrect_answer_count: row.incorrect_answer_count,
            skipped_question_count: row.skipped_question_count,
            attend_at: row.attend_at,
            student_level: row.student_level,
            percentage: row.percentage,
            easy_attend_question: row.easy_attend_question,
            medium_attend_question: row.medium_attend_question,
            hard_attend_question: row.hard_attend_question
          });
        }
      });

      const finalData = Object.values(studentsMap);
      res.status(200).json(finalData);
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};


const declineBitting = async (req, res) => {
  const { stuid, proid } = req.params;
  const { email } = req.body;

  try {
    const sql = `
      UPDATE bit
      SET bit_status_id = ?
      WHERE project_id = ? AND student_id = ?
    `;

    db.query(sql, [2, proid, stuid], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.send("db_error");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sivaranji5670@gmail.com",
          pass: "zicd vrfo zxbs jsfb",
        },
      });

      const mailOptions = {
        from: "sivaranji5670@gmail.com",
        to: email,
        subject: "Request Declined",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                  .header { text-align: center; padding: 10px 0; background-color: #dc3545; color: #ffffff; }
                  .content { padding: 20px; }
                  .footer { text-align: center; padding: 10px 0; background-color: #f4f4f4; color: #333333; font-size: 12px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Request Declined</h1>
                  </div>
                  <div class="content">
                      <p>Dear User,</p>
                      <p>We regret to inform you that your request has been declined by the admin.</p>
                      <p>Please contact us if you have any questions or need further assistance.</p>
                      <p>Best regards,</p>
                      <p><strong>Your Company Name</strong></p>
                  </div>
                  <div class="footer">
                      <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                      <p>1234 Street Name, City, State, 12345</p>
                  </div>
              </div>
          </body>
          </html>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email error:", error);
        } else {
          console.log("Decline email sent: " + info.response);
        }
      });

      res.send("declined");
    });
  } catch (e) {
    console.error("Server error:", e);
    res.send("admin_error");
  }
};

const addQuestion = async (req, res) => {
  // Validate the incoming request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    question_text,
    correct_answer,
    options,
    difficulty_level_id,
    category_id,
  } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO questions (question_text, correct_answer, options, difficulty_level_id, category_id) VALUES (?, ?, ?, ?, ?)",
      [
        question_text,
        correct_answer,
        JSON.stringify(options),
        difficulty_level_id,
        category_id,
      ]
    );

    res.status(201).json({
      message: "Question added successfully",
      questionId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const categoriesAndSub = async (req, res) => {
  const sql = `
    SELECT c.category_id, c.category_name, s.sub_category_id, s.sub_category_name
    FROM categories c
    LEFT JOIN subcategory s ON c.category_id = s.category_id
    ORDER BY c.category_name, s.sub_category_name;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const data = results.reduce((acc, row) => {
      const category = acc.find((c) => c.category_id === row.category_id);
      if (category) {
        category.subcategories.push({
          sub_category_id: row.sub_category_id,
          sub_category_name: row.sub_category_name,
        });
      } else {
        acc.push({
          category_id: row.category_id,
          category_name: row.category_name,
          subcategories: row.sub_category_id
            ? [
                {
                  sub_category_id: row.sub_category_id,
                  sub_category_name: row.sub_category_name,
                },
              ]
            : [],
        });
      }
      return acc;
    }, []);

    res.json(data);
  });
};

const categories = async (req, res) => {
  db.query(
    "SELECT category_id, category_name FROM categories",
    (err, results) => {
      if (err) {
        console.error("Error fetching categories:", err);
        res.status(500).send("Error fetching categories");
      } else {
        res.json(results);
      }
    }
  );
};

const questionCounting = async (req, res) => {
  const category_id = req.query.category_id;
  db.query(
    "SELECT COUNT(*) AS count FROM questions WHERE category_id = ?",
    [category_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching question count:", err);
        res.status(500).send("Error fetching question count");
      } else {
        res.json({ count: results[0].count });
      }
    }
  );
};

const testAssign = async (req, res) => {
  const {
    quiz_name,
    quiz_des,
    category_id,
    total_no_of_question,
    difficulty_level_id,
    easy_pass_mark,
    medium_pass_mark,
  } = req.body;
  db.query(
    "INSERT INTO testassign (quiz_name, quiz_des, category_id, total_no_of_question, difficulty_level_id, easy_pass_mark, medium_pass_mark) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      quiz_name,
      quiz_des,
      category_id,
      total_no_of_question,
      difficulty_level_id,
      easy_pass_mark,
      medium_pass_mark,
    ],
    (err, result) => {
      if (err) {
        console.error("Error assigning quiz:", err);
        res.status(500).send("Error assigning quiz");
      } else {
        res.send("Quiz assigned successfully");
      }
    }
  );
};


const checkBidStatus = async (req, res) => {
  try {
    const { stuid, proid } = req.params;

    const sql = `
      SELECT 
        CASE 
          WHEN COUNT(*) > 0 THEN true 
          ELSE false 
        END AS hasBidded,
        (SELECT bs.bit_status_name
         FROM bit b2
         JOIN bitstatuses bs ON b2.bit_status_id = bs.bit_status_id
         WHERE b2.student_id = ? 
         AND b2.project_id = ?
         ORDER BY b2.datetime DESC
         LIMIT 1) AS bitStatus
      FROM bit b
      WHERE b.student_id = ? 
      AND b.project_id = ?
    `;

    db.query(sql, [stuid, proid, stuid, proid], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }
      res.json({
        status: true,
        hasBidded: result[0].hasBidded === 1,
        bitStatus: result[0].bitStatus || null,
      });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
};




const testsByStudentSkillsCount = async (req, res) => {
  const { student_id } = req.params;

  try {
    const sql = `
      SELECT COUNT(DISTINCT t.test_id) AS test_count
      FROM student_skills ss
      JOIN testcreation t ON ss.skill_id = t.skill_id
      WHERE ss.student_id = ?
    `;

    db.query(sql, [student_id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }
      res.json({ status: true, test_count: result[0].test_count });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
};

const allStudentsTestsBySkillsCount = async (req, res) => {
  try {
    const sql = `
      SELECT 
        s.student_id,
        s.name,
        COUNT(DISTINCT t.test_id) AS test_count
      FROM students s
      LEFT JOIN student_skills ss ON s.student_id = ss.student_id
      LEFT JOIN testcreation t ON ss.skill_id = t.skill_id
      GROUP BY s.student_id, s.name
      ORDER BY s.student_id
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }
      res.json({ status: true, result });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
};



// const getAcceptedBits = async (req, res) => {
//   try {
//     const sql = `
//       SELECT 
//         b.bit_id,
//         b.student_id,
//         s.name AS student_name,
//         s.email,
//         s.roll_no,
//         p.project_id,
//         p.project_name,
//         c.college_name,
//         b.datetime,
//         COALESCE(bs.bit_status_name, 'accepted') AS bit_status_name,
//         (SELECT bs2.bit_status_name
//          FROM bit b2
//          JOIN bitstatuses bs2 ON b2.bit_status_id = bs2.bit_status_id
//          WHERE b2.student_id = b.student_id 
//          AND b2.project_id = b.project_id
//          ORDER BY b2.datetime DESC
//          LIMIT 1) AS latest_status_name
//       FROM bit b
//       JOIN students s ON b.student_id = s.student_id
//       JOIN projects p ON b.project_id = p.project_id
//       JOIN colleges c ON s.college_id = c.college_id
//       LEFT JOIN bitstatuses bs ON b.bit_status_id = bs.bit_status_id
//       WHERE b.bit_status_id = 1
//       ORDER BY b.datetime DESC
//     `;

//     db.query(sql, (err, result) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res.status(500).json({ status: false, msg: "db_error" });
//       }
//       res.json({ status: true, result });
//     });
//   } catch (e) {
//     console.error("Server error:", e);
//     res.status(500).json({ status: false, msg: "server_error" });
//   }
// }


const getAcceptedBits = async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.bit_id,
        b.student_id,
        s.name AS student_name,
        s.email,
        s.roll_no,
        p.project_id,
        p.project_name,
        c.college_name,
        b.datetime,
        COALESCE(bs.bit_status_name, 'accepted') AS bit_status_name,
        (SELECT bs2.bit_status_name
         FROM bit b2
         JOIN bitstatuses bs2 ON b2.bit_status_id = bs2.bit_status_id
         WHERE b2.student_id = b.student_id 
         AND b2.project_id = b.project_id
         ORDER BY b2.datetime DESC
         LIMIT 1) AS latest_status_name
      FROM bit b
      JOIN students s ON b.student_id = s.student_id
      JOIN projects p ON b.project_id = p.project_id
      JOIN colleges c ON s.college_id = c.college_id
      LEFT JOIN bitstatuses bs ON b.bit_status_id = bs.bit_status_id
      WHERE b.bit_status_id != 2
      ORDER BY b.datetime DESC
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }
      res.json({ status: true, result });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
}





const getBitStatuses = async (req, res) => {
  try {
    const sql = `SELECT bit_status_id, bit_status_name FROM bitstatuses`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }
      res.json({ status: true, result });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
};

// const updateOrCreateBitStatus = async (req, res) => {
//   const { bit_id, student_id, project_id, bit_status_id, email } = req.body;

//   try {
//     // Validate required fields
//     if (!bit_id || !student_id || !project_id || !bit_status_id || !email) {
//       return res.status(400).json({ status: false, msg: "All fields are required" });
//     }

//     // If bit_status_id is 2 (declined), update the existing record
//     if (bit_status_id === 2) {
//       const sql = `
//         UPDATE bit
//         SET bit_status_id = ?
//         WHERE bit_id = ? AND student_id = ? AND project_id = ? AND bit_status_id = 1
//       `;
//       db.query(sql, [bit_status_id, bit_id, student_id, project_id], (err, result) => {
//         if (err) {
//           console.error("Database error:", err);
//           return res.status(500).json({ status: false, msg: "db_error" });
//         }
//         if (result.affectedRows === 0) {
//           return res.status(400).json({ status: false, msg: "No approved bid found to decline" });
//         }

//         // Send email notification for decline
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             user: "sivaranji5670@gmail.com",
//             pass: "zicd vrfo zxbs jsfb",
//           },
//         });

//         const mailOptions = {
//           from: "sivaranji5670@gmail.com",
//           to: email,
//           subject: "Request Declined",
//           html: `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <style>
//                     body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
//                     .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
//                     .header { text-align: center; padding: 10px 0; background-color: #dc3545; color: #ffffff; }
//                     .content { padding: 20px; }
//                     .footer { text-align: center; padding: 10px 0; background-color: #f4f4f4; color: #333333; font-size: 12px; }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="header">
//                         <h1>Request Declined</h1>
//                     </div>
//                     <div class="content">
//                         <p>Dear User,</p>
//                         <p>We regret to inform you that your request has been declined by the admin.</p>
//                         <p>Please contact us if you have any questions or need further assistance.</p>
//                         <p>Best regards,</p>
//                         <p><strong>Your Company Name</strong></p>
//                     </div>
//                     <div class="footer">
//                         <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
//                         <p>1234 Street Name, City, State, 12345</p>
//                     </div>
//                 </div>
//             </body>
//             </html>
//           `,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.error("Email error:", error);
//           } else {
//             console.log("Decline email sent: " + info.response);
//           }
//         });

//         res.json({ status: true, msg: "declined" });
//       });
//     } else {
//       // For other statuses, create a new bit record
//       const sql = `
//         INSERT INTO bit (student_id, project_id, bit_status_id, datetime)
//         VALUES (?, ?, ?, NOW())
//       `;
//       db.query(sql, [student_id, project_id, bit_status_id], (err, result) => {
//         if (err) {
//           console.error("Database error:", err);
//           return res.status(500).json({ status: false, msg: "db_error" });
//         }

//         // Send email notification for status change
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             user: "sivaranji5670@gmail.com",
//             pass: "zicd vrfo zxbs jsfb",
//           },
//         });

//         const mailOptions = {
//           from: "sivaranji5670@gmail.com",
//           to: email,
//           subject: "Bid Status Updated",
//           html: `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <style>
//                     body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
//                     .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
//                     .header { text-align: center; padding: 10px 0; background-color: #007bff; color: #ffffff; }
//                     .content { padding: 20px; }
//                     .footer { text-align: center; padding: 10px 0; background-color: #f4f4f4; color: #333333; font-size: 12px; }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="header">
//                         <h1>Bid Status Updated</h1>
//                     </div>
//                     <div class="content">
//                         <p>Dear User,</p>
//                         <p>Your bid status has been updated to "${bit_status_id === 3 ? 'In Progress' : bit_status_id === 4 ? 'Completed' : bit_status_id === 5 ? 'Waiting for Client Approval' : bit_status_id === 6 ? 'Client Approved' : 'Payment Received'}" by the admin.</p>
//                         <p>Please contact us if you have any questions or need further assistance.</p>
//                         <p>Best regards,</p>
//                         <p><strong>Your Company Name</strong></p>
//                     </div>
//                     <div class="footer">
//                         <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
//                         <p>1234 Street Name, City, State, 12345</p>
//                     </div>
//                 </div>
//             </body>
//             </html>
//           `,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.error("Email error:", error);
//           } else {
//             console.log("Status update email sent: " + info.response);
//           }
//         });

//         res.json({ status: true, msg: "status_updated" });
//       });
//     }
//   } catch (e) {
//     console.error("Server error:", e);
//     res.status(500).json({ status: false, msg: "server_error" });
//   }
// };


// const savePaymentDetails = async (req, res) => {
//   const { student_id, project_id, from_account_number, to_account_number, transaction_id, transaction_screenshot } = req.body;

//   try {
//     // Validate required fields
//     if (!student_id || !project_id || !from_account_number || !to_account_number || !transaction_id || !transaction_screenshot) {
//       return res.status(400).json({ status: false, msg: "All payment fields are required" });
//     }

//     const sql = `
//       INSERT INTO payment_details (student_id, project_id, from_account_number, to_account_number, transaction_id, transaction_screenshot)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     db.query(sql, [student_id, project_id, from_account_number, to_account_number, transaction_id, transaction_screenshot], (err, result) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res.status(500).json({ status: false, msg: "db_error" });
//       }

//       res.json({ status: true, msg: "payment_details_saved" });
//     });
//   } catch (e) {
//     console.error("Server error:", e);
//     res.status(500).json({ status: false, msg: "server_error" });
//   }
// };




// Set up multer storage configuration
// Set up multer storage configuration



// Set up multer storage configuration


// Set up multer storage configuration



const updateBitStatus = async (req, res) => {
  const { bit_id, student_id, project_id, bit_status_id, email } = req.body;

  try {
    // Validate required fields
    if (!bit_id || !student_id || !project_id || !bit_status_id || !email) {
      return res.status(400).json({ status: false, msg: "All fields are required" });
    }

    // Update the existing record
    const sql = `
      UPDATE bit
      SET bit_status_id = ?
      WHERE bit_id = ? AND student_id = ? AND project_id = ?
    `;
    db.query(sql, [bit_status_id, bit_id, student_id, project_id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }
      if (result.affectedRows === 0) {
        return res.status(400).json({ status: false, msg: "No matching bid found to update" });
      }

      // Send email notification based on bit_status_id
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sivaranji5670@gmail.com",
          pass: "zicd vrfo zxbs jsfb",
        },
      });

      let mailOptions;
      if (bit_status_id === 2) {
        // Email for declined status
        mailOptions = {
          from: "sivaranji5670@gmail.com",
          to: email,
          subject: "Request Declined",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                    .header { text-align: center; padding: 10px 0; background-color: #dc3545; color: #ffffff; }
                    .content { padding: 20px; }
                    .footer { text-align: center; padding: 10px 0; background-color: #f4f4f4; color: #333333; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Request Declined</h1>
                    </div>
                    <div class="content">
                        <p>Dear User,</p>
                        <p>We regret to inform you that your request has been declined by the admin.</p>
                        <p>Please contact us if you have any questions or need further assistance.</p>
                        <p>Best regards,</p>
                        <p><strong>Your Company Name</strong></p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                        <p>1234 Street Name, City, State, 12345</p>
                    </div>
                </div>
            </body>
            </html>
          `,
        };
      } else {
        // Email for other status updates
        mailOptions = {
          from: "sivaranji5670@gmail.com",
          to: email,
          subject: "Bid Status Updated",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                    .header { text-align: center; padding: 10px 0; background-color: #007bff; color: #ffffff; }
                    .content { padding: 20px; }
                    .footer { text-align: center; padding: 10px 0; background-color: #f4f4f4; color: #333333; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Bid Status Updated</h1>
                    </div>
                    <div class="content">
                        <p>Dear User,</p>
                        <p>Your bid status has been updated to "${bit_status_id === 1 ? 'Accepted' : bit_status_id === 3 ? 'In Progress' : bit_status_id === 4 ? 'Completed' : bit_status_id === 5 ? 'Waiting for Client Approval' : bit_status_id === 6 ? 'Client Approved' : 'Payment Received'}" by the admin.</p>
                        <p>Please contact us if you have any questions or need further assistance.</p>
                        <p>Best regards,</p>
                        <p><strong>Your Company Name</strong></p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                        <p>1234 Street Name, City, State, 12345</p>
                    </div>
                </div>
            </body>
            </html>
          `,
        };
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email error:", error);
        } else {
          console.log("Status update email sent: " + info.response);
        }
      });

      res.json({ status: true, msg: bit_status_id === 2 ? "declined" : "status_updated" });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
};




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'public', 'payment_screenshots');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `payment-${uniqueSuffix}${ext}`);
  },
});

// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and PDF files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const savePaymentDetails = async (req, res) => {
  try {
    const { student_id, project_id, from_account_number, to_account_number, transaction_id } = req.body;
    const transaction_screenshot = req.file ? `payment_screenshots/${req.file.filename}` : null;

    // Validate all required fields
    if (!student_id || !project_id || !from_account_number || !to_account_number || !transaction_id || !transaction_screenshot) {
      return res.status(400).json({ status: false, msg: 'All payment details, including the screenshot, are required' });
    }

    // Validate student_id exists
    const studentCheck = await db.query('SELECT student_id FROM students WHERE student_id = ?', [student_id]);
    if (!studentCheck || studentCheck.length === 0) {
      return res.status(400).json({ status: false, msg: 'Invalid student_id: Student does not exist' });
    }

    // Validate project_id exists
    const projectCheck = await db.query('SELECT project_id FROM projects WHERE project_id = ?', [project_id]);
    if (!projectCheck || projectCheck.length === 0) {
      return res.status(400).json({ status: false, msg: 'Invalid project_id: Project does not exist' });
    }

    // Execute the query
    const query = `
      INSERT INTO payment_details (
        student_id, 
        project_id, 
        from_account_number, 
        to_account_number, 
        transaction_id, 
        transaction_screenshot
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      student_id,
      project_id,
      from_account_number,
      to_account_number,
      transaction_id,
      transaction_screenshot,
    ];

    const result = await db.query(query, values);

    // Check if the query was successful
    if (result && result.affectedRows > 0) {
      return res.json({ status: true, msg: 'Payment details saved successfully' });
    } else {
      return res.status(500).json({ status: false, msg: 'Failed to save payment details' });
    }
  } catch (err) {
    console.error('Error saving payment details:', err);
    // Handle specific foreign key errors
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ status: false, msg: 'Foreign key constraint failed: Invalid student_id or project_id' });
    }
    return res.status(500).json({ status: false, msg: `Server error: ${err.message}` });
  }
};

export {
  studentsData,
  studentDetails,
  studentsCount,
  filterCollegeStduents,
  filterStudentSkills,
  addProjects,
  skillBasedProjects,
  studentBitInfo,
  getAllProjects,
  getBitInfo,
  bittedInfo,
  acceptBitting,
  addQuestion,
  categoriesAndSub,
  categories,
  questionCounting,
  testAssign,
  declineBitting, // Add to exports
  checkBidStatus, // Add to exports,
  getAllStudentAndTestData,
  testsByStudentSkillsCount,
  
  allStudentsTestsBySkillsCount,
  getAcceptedBits, // Add new function to exports
  getBitStatuses, // New function
  updateBitStatus, // New function

  savePaymentDetails, // New function


};