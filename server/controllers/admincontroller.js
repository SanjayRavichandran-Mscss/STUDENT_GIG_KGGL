import db from "../config/db.js";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";

const studentDetails = async (req, res) => {
  try {
    const studentsSql = `
      SELECT 
        s.student_id,
        s.roll_no,
        s.name,
        s.email,
        s.mobile_number,
        s.profile_photo,
        s.year,
        s.semester,
        s.resume_file,
        s.github_link,
        s.linkedin_link,
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
      }),
    ]);

    // Group skills by student_id
    const skillsByStudent = {};
    skills.forEach((skill) => {
      if (!skillsByStudent[skill.student_id]) {
        skillsByStudent[skill.student_id] = [];
      }
      skillsByStudent[skill.student_id].push({
        skill_id: skill.skill_id,
        skill_name: skill.skill_name,
        skill_url: skill.skill_url,
        skill_description: skill.skill_description,
      });
    });

    // Combine the data
    const result = students.map((student) => ({
      ...student,
      skills: skillsByStudent[student.student_id] || [],
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


const addProjects = async (req, res) => {
  const { pname, pdes, skill, date, level_id, number_of_students, created_by } = req.body;

  try {
    // Validate required fields
    if (!pname || !pdes || !skill || !date || !level_id || !number_of_students || !created_by) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Validate number_of_students is a positive integer
    if (!Number.isInteger(Number(number_of_students)) || number_of_students <= 0) {
      return res.status(400).json({ msg: "Number of students must be a positive integer" });
    }

    // Validate created_by is a positive integer
    if (!Number.isInteger(Number(created_by)) || created_by <= 0) {
      return res.status(400).json({ msg: "Created by must be a positive integer" });
    }

    const sql =
      "INSERT INTO projects (project_name, description, stack, expiry_date, level_id, number_of_students, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [pname, pdes, skill, date, level_id, number_of_students, created_by], (err, result) => {
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
      s.skill_name,
      p.level_id,
      d.level_name,
      p.number_of_students,
      p.created_at,
      p.created_by,
      p.expiry_date,
      COUNT(b.bit_id) AS bit_count,
      st.name AS created_by_name,
      st.email,
      st.mobile_number
    FROM 
      projects p
    LEFT JOIN 
      skills s ON p.stack = s.skill_id
    LEFT JOIN 
      difficultylevels d ON p.level_id = d.level_id
    LEFT JOIN 
      bit b ON p.project_id = b.project_id
    LEFT JOIN 
      students st ON p.created_by = st.student_id
    GROUP BY 
      p.project_id, p.project_name, p.description, p.stack, s.skill_name, p.level_id, 
      d.level_name, p.number_of_students, p.created_at, p.created_by, p.expiry_date, 
      st.name, st.email, st.mobile_number`;

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
const getAllProjectsForStudentRequired = async (req, res) => {
  try {
    const sql = `SELECT 
      p.project_id,
      p.project_name,
      p.description,
      p.stack,
      s.skill_name,
      p.level_id,
      d.level_name,
      p.number_of_students,
      p.created_at,
      p.created_by,
      p.expiry_date,
      COUNT(b.bit_id) AS bit_count,
      st.name AS created_by_name,
      st.email,
      st.mobile_number
    FROM 
      projects p
    LEFT JOIN 
      skills s ON p.stack = s.skill_id
    LEFT JOIN 
      difficultylevels d ON p.level_id = d.level_id
    LEFT JOIN 
      bit b ON p.project_id = b.project_id
    LEFT JOIN 
      students st ON p.created_by = st.student_id
       WHERE 
      b.bit_status_id IS NULL
    GROUP BY 
      p.project_id, p.project_name, p.description, p.stack, s.skill_name, p.level_id, 
      d.level_name, p.number_of_students, p.created_at, p.created_by, p.expiry_date, 
      st.name, st.email, st.mobile_number`;

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
          user: "sanjayravichandran006@gmail.com",
          pass: "lpzn amam wlgw kwdl",
        },
      });

      const mailOptions = {
        from: "sanjayravichandran006@gmail.com",
        to: email,
        subject: "Confirmation message",
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
                      <p>We are pleased to inform you that your request has been <strong>accepted</strong> by the admin.</p>
                      <p>You can now proceed with the next steps as outlined in the instructions provided.</p>
                      <p>If you have any questions or need further assistance, feel free to contact us.</p>
                      <p>Best regards,</p>
                      <p><strong>KG Genius Labs</strong></p>
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

      // No UPDATE projects query, as status_id is removed
      res.send("updated");
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

      results.forEach((row) => {
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
            test_results: [],
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
            hard_attend_question: row.hard_attend_question,
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
          user: "sanjayravichandran006@gmail.com",
          pass: "lpzn amam wlgw kwdl",
        },
      });

      const mailOptions = {
        from: "sanjayravichandran006@gmail.com",
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
                      <p>We regret to inform you that your request has been <strong>declined</strong> by the admin.</p>
                      <p>Please contact us if you have any questions or need further assistance.</p>
                      <p>Best regards,</p>
                      <p><strong>KG Genius Labs</strong></p>
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
};

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

const updateBitStatus = async (req, res) => {
  const { bit_id, student_id, project_id, bit_status_id, email } = req.body;

  try {
    // Validate required fields
    if (!bit_id || !student_id || !project_id || !bit_status_id || !email) {
      return res
        .status(400)
        .json({ status: false, msg: "All fields are required" });
    }

    // Update the existing record
    const sql = `
      UPDATE bit
      SET bit_status_id = ?
      WHERE bit_id = ? AND student_id = ? AND project_id = ?
    `;
    db.query(
      sql,
      [bit_status_id, bit_id, student_id, project_id],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ status: false, msg: "db_error" });
        }
        if (result.affectedRows === 0) {
          return res
            .status(400)
            .json({ status: false, msg: "No matching bid found to update" });
        }

        // Send email notification based on bit_status_id
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sanjayravichandran006@gmail.com",
            pass: "lpzn amam wlgw kwdl",
          },
        });

        let mailOptions;
        if (bit_status_id === 2) {
          // Email for declined status
          mailOptions = {
            from: "sanjayravichandran006@gmail.com",
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
                        <p>We regret to inform you that your request has been <strong>declined</strong> by the admin.</p>
                        <p>Please contact us if you have any questions or need further assistance.</p>
                        <p>Best regards,</p>
                        <p><strong>KG Genius Labs</strong></p>
                        
                    </div>
                   
                </div>
            </body>
            </html>
          `,
          };
        } else {
          // Email for other status updates
          mailOptions = {
            from: "sanjayravichandran006@gmail.com",
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
<p>Your bid status has been updated by the administration team. Please visit the KGGL Gig portal to review the details.</p>                        <p>Please contact us if you have any questions or need further assistance.</p>
                        <p>Best regards,</p>
                        <p><strong>KG Genius Labs</strong></p>
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

        res.json({
          status: true,
          msg: bit_status_id === 2 ? "declined" : "status_updated",
        });
      }
    );
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      process.cwd(),
      "public",
      "payment_screenshots"
    );
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `payment-${uniqueSuffix}${ext}`);
  },
});

// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG, and PDF files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const savePaymentDetails = (req, res) => {
  try {
    const {
      student_id,
      project_id,
      from_account_number,
      to_account_number,
      transaction_id,
    } = req.body;
    const transaction_screenshot = req.file
      ? `payment_screenshots/${req.file.filename}`
      : null;

    // Validate all required fields
    if (
      !student_id ||
      !project_id ||
      !from_account_number ||
      !to_account_number ||
      !transaction_id ||
      !transaction_screenshot
    ) {
      return res
        .status(400)
        .json({
          status: false,
          msg: "All payment details, including the screenshot, are required",
        });
    }

    // Validate student_id exists
    db.query(
      "SELECT student_id FROM students WHERE student_id = ?",
      [student_id],
      (err, studentResult) => {
        if (err) {
          console.error("Database error (student check):", err);
          return res.status(500).json({ status: false, msg: "Server error" });
        }
        if (!studentResult || studentResult.length === 0) {
          return res
            .status(400)
            .json({
              status: false,
              msg: "Invalid student_id: Student does not exist",
            });
        }

        // Validate project_id exists
        db.query(
          "SELECT project_id FROM projects WHERE project_id = ?",
          [project_id],
          (err, projectResult) => {
            if (err) {
              console.error("Database error (project check):", err);
              return res
                .status(500)
                .json({ status: false, msg: "Server error" });
            }
            if (!projectResult || projectResult.length === 0) {
              return res
                .status(400)
                .json({
                  status: false,
                  msg: "Invalid project_id: Project does not exist",
                });
            }

            // Execute the insert query
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

            db.query(query, values, (err, result) => {
              if (err) {
                console.error("Database error (insert):", err);
                // Handle specific foreign key errors
                if (
                  err.code === "ER_NO_REFERENCED_ROW_2" ||
                  err.code === "ER_ROW_IS_REFERENCED_2"
                ) {
                  return res
                    .status(400)
                    .json({
                      status: false,
                      msg: "Foreign key constraint failed: Invalid student_id or project_id",
                    });
                }
                return res
                  .status(500)
                  .json({ status: false, msg: `Server error: ${err.message}` });
              }

              // Check if the query was successful
              if (result && result.affectedRows > 0) {
                return res.json({
                  status: true,
                  msg: "Payment details saved successfully",
                });
              } else {
                return res
                  .status(500)
                  .json({
                    status: false,
                    msg: "Failed to save payment details",
                  });
              }
            });
          }
        );
      }
    );
  } catch (err) {
    console.error("Error saving payment details:", err);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
};

// Get transactions
const getTransactions = async (req, res) => {
  try {
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
    const transactions = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else reject(results);
      });
    });
    return res.status(200).json({
      status: true,
      message: "Transaction fetched successfully",
      result: transactions,
    });
  } catch (error) {
    console.error("Error in getTransactions:", error);
    return res.status(500).json({
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
      return res
        .status(400)
        .json({ msg: "Student ID and Project ID are required" });
    }
    const sql = `
      SELECT payment_id, student_id, project_id, from_account_number, to_account_number,
      transaction_id, transaction_screenshot, created_at
      FROM payment_details
      WHERE student_id = ? AND project_id = ?
    `;
    const payment = await new Promise((resolve, reject) => {
      db.query(sql, [student_id, project_id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
    if (!payment) {
      return res
        .status(200)
        .json({
          status: false,
          payment: null,
          msg: "No payment details found",
        });
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


const getExpiredProjects = async (req, res) => {
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
WHERE 
  p.expiry_date <= NOW()
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

const updateProjectExpiry = async (req, res) => {
  try {
    const { project_id, new_expiry_date } = req.body;

    // Validate input
    if (!project_id || !new_expiry_date) {
      return res.status(400).send("project_id and new_expiry_date are required");
    }

    // Validate that new_expiry_date is in the future
    const now = new Date();
    const newExpiry = new Date(new_expiry_date);
    if (newExpiry <= now) {
      return res.status(400).send("new_expiry_date must be in the future");
    }

    const sql = `UPDATE projects SET expiry_date = ? WHERE project_id = ?`;
    db.query(sql, [new_expiry_date, project_id], (err, result) => {
      if (err) {
        return res.status(500).send("db_error");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("project_not_found");
      }
      res.send({ message: "Expiry date updated successfully" });
    });
  } catch (e) {
    res.status(500).send("admin_error");
  }
};


const NonTechStudentDetails = async (req, res) => {
  try {
    const studentsSql = `
      SELECT 
        s.student_id,
        s.roll_no,
        s.name,
        s.email,
        s.mobile_number,
        s.profile_photo,
        s.year,
        s.semester,
        s.resume_file,
        s.github_link,
        s.linkedin_link,
        c.college_name,
        co.course_name AS department
      FROM students s
      LEFT JOIN colleges c ON s.college_id = c.college_id
      LEFT JOIN course co ON s.degree = co.course_id
      WHERE s.role_id = 2 AND co.technical_status = 0
    `;

    // Get all skills
    const skillsSql = `
      SELECT 
        ss.student_id,
        ss.skill_id,
        sk.skill_name,
        ss.skill_url,
        ss.skill_description
      FROM student_skills ss
      LEFT JOIN skills sk ON ss.skill_id = sk.skill_id
      WHERE ss.student_id IN (
        SELECT s.student_id 
        FROM students s
        LEFT JOIN course co ON s.degree = co.course_id
        WHERE s.role_id = 2 AND co.technical_status = 0
      )
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
      }),
    ]);

    // Group skills by student_id
    const skillsByStudent = {};
    skills.forEach((skill) => {
      if (!skillsByStudent[skill.student_id]) {
        skillsByStudent[skill.student_id] = [];
      }
      skillsByStudent[skill.student_id].push({
        skill_id: skill.skill_id,
        skill_name: skill.skill_name,
        skill_url: skill.skill_url,
        skill_description: skill.skill_description,
      });
    });

    // Combine the data
    const result = students.map((student) => ({
      ...student,
      skills: skillsByStudent[student.student_id] || [],
    }));

    res.json({ status: true, result });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ status: false, msg: "admin_error" });
  }
};


const InterviewScheduleMail = async (req, res) => {
  const { to, bcc, cc, subject, emailBody, name } = req.body;

  try {
    // Validate required fields
    if (!to || !subject || !emailBody || !name) {
      return res.status(400).json({ status: "error", msg: "To, subject, body, and name are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "sanjayravichandran006@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "lpzn amam wlgw kwdl",
      },
    });

    // Handle single or multiple recipients
    const recipients = Array.isArray(to) ? to : [to];
    const names = Array.isArray(name) ? name : [name];
    const bccRecipients = Array.isArray(bcc) ? bcc : bcc ? [bcc] : [];
    const ccRecipients = Array.isArray(cc) ? cc : cc ? [cc] : [];

    const emailPromises = recipients.map(async (recipient, index) => {
      const mailOptions = {
        from: "sanjayravichandran006@gmail.com",
        to: recipient,
        bcc: bccRecipients, // Include BCC recipients
        cc: ccRecipients, // Include CC recipients
        subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                  .header { text-align: center; padding: 10px 0; background-color: #4f46e5; color: #ffffff; }
                  .content { padding: 20px; }
                  .footer { text-align: center; padding: 10px 0; background-color: #f4f4f4; color: #333333; font-size: 12px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>KG Genius Labs</h1>
                  </div>
                  <div class="content">
                      <p>Dear ${names[index] || "User"},</p>
                      <p>${emailBody}</p>
                      <p>Best regards,</p>
                      <p><strong>KG Genius Labs</strong></p>
                  </div>
              </div>
          </body>
          </html>
        `,
      };

      console.log(`Sending email to ${recipient} with BCC: ${bccRecipients.join(", ")} and CC: ${ccRecipients.join(", ")}`);
      await transporter.sendMail(mailOptions);
      return { status: true };
    });

    const results = await Promise.all(emailPromises);
    const allSuccess = results.every((result) => result.status);

    if (allSuccess) {
      res.json({ status: true, msg: "Emails sent successfully" });
    } else {
      res.status(500).json({ status: false, msg: "Some emails failed to send" });
    }
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ status: false, msg: "Failed to send email", error: err.message });
  }
};



const ReferralMail = async (req, res) => {
  const { to, subject, body } = req.body;

  try {
    // Validate required fields
    if (!to || !subject || !body) {
      return res.status(400).json({ msg: 'All fields (to, subject, body) are required' });
    }

    // Validate email format (basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ msg: 'Invalid email address' });
    }

    // Fetch recipient name from students table
    let recipientName = 'User';
    const sql = 'SELECT name FROM students WHERE email = ?';
    db.query(sql, [to], (err, result) => {
      if (err) {
        console.error('Database error fetching name:', err);
        // Continue with default 'User' name
      } else if (result.length > 0) {
        recipientName = result[0].name || 'User';
      }

      // Escape body to prevent XSS
      const escapedBody = body
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

      // HTML template
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .header { text-align: center; padding: 10px 0; background-color: #4f46e5; color: #ffffff; }
                .content { padding: 20px; }
                .footer { text-align: center; padding: 10px 0; background-color: #f4f4f4; color: #333333; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>KG Genius Labs</h1>
                </div>
                <div class="content">
                    <p>Dear ${recipientName},</p>
                    <p>${escapedBody}</p>
                    <p>Best regards,</p>
                    <p><strong>KG Genius Labs</strong></p>
                </div>
            </div>
        </body>
        </html>
      `;

      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sanjayravichandran006@gmail.com',
          pass: 'lpzn amam wlgw kwdl',
        },
      });

      // Email options
      const mailOptions = {
        from: '"Referral System" <sanjayravichandran006@gmail.com>',
        to,
        subject,
        html: htmlTemplate,
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email error:', error);
          return res.status(500).json({ msg: 'email_error' });
        }
        res.json({ msg: 'email_sent' });
      });
    });
  } catch (e) {
    console.error('Server error:', e);
    res.status(500).json({ msg: 'email_error' });
  }
};



export {
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
  declineBitting,
  checkBidStatus,
  getAllStudentAndTestData,
  testsByStudentSkillsCount,
  allStudentsTestsBySkillsCount,
  getAcceptedBits,
  getBitStatuses,
  updateBitStatus,
  savePaymentDetails,
  getTransactions,
  checkPaymentStatus,
  getExpiredProjects,
  updateProjectExpiry,
  NonTechStudentDetails,
  InterviewScheduleMail,
  ReferralMail,
  getAllProjectsForStudentRequired

};
