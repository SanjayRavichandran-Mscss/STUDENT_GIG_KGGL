import db from "../config/db.js";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";

const studentsData = async (req, res) => {
  try {
    const sql = `select * from students where role_id=1`;

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

const addProjects = async (req, res) => {
  const { pname, pdes, skill, date } = req.body;

  try {
    const sql =
      "insert into projects(project_name,description,stack,expiry_date,status_id)values(?,?,?,?,1)";

    db.query(sql, [pname, pdes, skill, date], (err, result) => {
      if (err) {
        res.json({ msg: "db_error" });
        console.log(err);
      } else {
        res.json({ msg: "added" });
      }
    });
  } catch (e) {
    res.send("admin_error");
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
    const sql = `SELECT project_id, COUNT(*) AS count
  FROM bit
  GROUP BY project_id;`;

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

const bittedInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `SELECT p.project_id,p.project_name,b.bit_id, b.student_id,s.name AS student_name,s.email,s.college_id, c.college_name, b.datetime, b.bit_status_id
  FROM projects p
  JOIN bit b ON p.project_id = b.project_id
  JOIN students s ON b.student_id = s.student_id
  JOIN colleges c ON s.college_id = c.college_id
  WHERE p.project_id = ?`;

    db.query(sql, [id], (err, result) => {
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

const acceptBitting = async (req, res) => {
  const { stuid, proid } = req.params;
  const { email } = req.body;

  try {
    const sql = `UPDATE bit
  SET bit_status_id = CASE
      WHEN student_id = ? THEN 1 
      ELSE 2 
  END
  WHERE project_id = ?`;

    db.query(sql, [stuid, proid], (err, result) => {
      if (err) {
        res.send("dB_error", err);
      } else {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sivaranji5670@gmail.com",
            pass: "zicd vrfo zxbs jsfb ",
          },
        });

        var mailOptions = {
          from: "sivaranji5670@gmail.com",
          to: email,
          subject: "Confirmation msg",
          html: `<!DOCTYPE html>
          <html>
          <head>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #007bff;
                      color: #ffffff;
                  }
                  .content {
                      padding: 20px;
                  }
                  .footer {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #f4f4f4;
                      color: #333333;
                      font-size: 12px;
                  }
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
                      <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                      <p>1234 Street Name, City, State, 12345</p>
                  </div>
              </div>
          </body>
          </html>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        const sql = `DELETE FROM bit
      WHERE bit_status_id = 2
        AND project_id = ?`;

        db.query(sql, [proid], (err, result) => {
          if (err) {
            res.send("sub_query_error");
          } else {
            const sql = `UPDATE projects
          SET status_id = (SELECT status_id FROM status WHERE status = 'assigned')
          WHERE project_id = ?
          AND EXISTS (
              SELECT 1
              FROM bit
              WHERE project_id = ?
              AND bit_status_id = 1
          );`;
            db.query(sql, [proid, proid], (err, result) => {
              if (err) {
                res.send("this_is_inner_most_query_error");
              } else {
                res.send("updated");
              }
            });
          }
        });
      }
    });
  } catch (e) {
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

export {
  studentsData,
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
  testAssign
};





































