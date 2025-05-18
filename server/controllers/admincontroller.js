import db from "../config/db.js";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";

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


const studentDetails = async (req, res) => {
  try {
    const sql = `
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
        co.course_name AS department,
        GROUP_CONCAT(
          JSON_OBJECT(
            'skill_id', ss.skill_id,
            'skill_name', sk.skill_name,
            'skill_url', ss.skill_url,
            'skill_description', ss.skill_description
          )
        ) AS skills
      FROM students s
      LEFT JOIN colleges c ON s.college_id = c.college_id
      LEFT JOIN course co ON s.degree = co.course_id
      LEFT JOIN student_skills ss ON s.student_id = ss.student_id
      LEFT JOIN skills sk ON ss.skill_id = sk.skill_id
      WHERE s.role_id = 2
      GROUP BY s.student_id
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }

      // Parse skills JSON strings into arrays
      const parsedResult = result.map((row) => ({
        ...row,
        skills: row.skills ? JSON.parse(`[${row.skills}]`) : [],
      }));

      res.json({ status: true, result: parsedResult });
    });
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

      FROM student s
      LEFT JOIN testresults tr ON s.student_id = tr.student_id
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
  const { stuid, proid } = req.params;

  try {
    const sql = `
      SELECT 
        b.bit_status_id,
        COALESCE(bs.bit_status_name, 'pending') AS bit_status_name
      FROM bit b
      LEFT JOIN bitstatuses bs ON b.bit_status_id = bs.bit_status_id
      WHERE b.student_id = ? AND b.project_id = ?
      LIMIT 1
    `;

    db.query(sql, [stuid, proid], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }
      const hasBidded = result.length > 0;
      const bitStatus = hasBidded ? result[0].bit_status_name : null;
      res.json({ hasBidded, bitStatus });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "admin_error" });
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
  allStudentsTestsBySkillsCount
};