import db from "../config/db.js";
import path from "path";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { promisify } from "util";

// Promisify db.query for async/await
const dbQuery = promisify(db.query).bind(db);

// Generate 8-digit passkey
const generatePasskey = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const StudentRegistration = async (req, res) => {
  let {
    roll_no,
    name,
    email,
    password,
    mobile_number,
    selectedCategory,
    selectedCollege,
    year,
    semester,
  } = req.body;

  try {
    // Validate password length (only require 8 characters)
    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check if email already exists
    const checkEmailQuery = "SELECT COUNT(*) AS count FROM students WHERE email = ?";
    const emailResult = await dbQuery(checkEmailQuery, [email]);
    if (emailResult[0].count > 0) {
      return res.status(200).send("Email already exists");
    }

    // Check if roll_no already exists
    const checkRollNoQuery = "SELECT COUNT(*) AS count FROM students WHERE roll_no = ?";
    const rollNoResult = await dbQuery(checkRollNoQuery, [roll_no]);
    if (rollNoResult[0].count > 0) {
      return res.status(200).send("Roll number already exists");
    }

    // Check if mobile_number already exists
    const checkMobileQuery = "SELECT COUNT(*) AS count FROM students WHERE mobile_number = ?";
    const mobileResult = await dbQuery(checkMobileQuery, [mobile_number]);
    if (mobileResult[0].count > 0) {
      return res.status(200).send("Mobile number already exists");
    }

    // Convert semester to integer (e.g., "1st Semester" -> 1)
    const semesterInt = parseInt(semester.match(/\d+/)[0]);

    // Insert student into students table
    const registrationSql =
      "INSERT INTO students(roll_no, name, email, password, mobile_number, degree, year, semester, college_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await dbQuery(registrationSql, [
      roll_no,
      name,
      email,
      password,
      mobile_number,
      selectedCollege,
      year,
      semesterInt,
      selectedCategory,
    ]);

    res.json({ status: "inserted" });
  } catch (error) {
    console.error("Error in StudentRegistration:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};


const StudentLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Email and password are required" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const loginSql = "SELECT * FROM students WHERE email = ?";
    const result = await dbQuery(loginSql, [email]);

    if (result.length === 0) {
      return res.status(401).json({ status: "both_are_invalid", message: "Invalid email" });
    }

    const user = result[0];
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({ status: "invalid_user", message: "Invalid password" });
    }

    const token = jwt.sign({ user: user.student_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie (optional, keep for compatibility)
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Include accessToken in JSON response
    res.status(200).json({
      status: "user",
      id: user.student_id,
      role: user.role_id,
      name: user.name,
      accessToken: token,
    });
  } catch (error) {
    console.error("Error in StudentLogin:", error);
    res.status(500).json({ status: "error", message: "Server error during login" });
  }
};

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

const checkDuplicateLinks = async (req, res) => {
  const { github_link, linkedin_link, student_id } = req.body;

  try {
    const query = `
      SELECT github_link, linkedin_link
      FROM students
      WHERE (github_link = ? OR linkedin_link = ?)
      AND student_id != ?`;
    const result = await dbQuery(query, [github_link, linkedin_link, student_id]);

    const duplicates = {
      github: false,
      linkedin: false,
    };

    result.forEach((row) => {
      if (row.github_link === github_link && github_link) {
        duplicates.github = true;
      }
      if (row.linkedin_link === linkedin_link && linkedin_link) {
        duplicates.linkedin = true;
      }
    });

    res.json({
      status: "success",
      duplicates,
    });
  } catch (error) {
    console.error("Error in checkDuplicateLinks:", error);
    res.status(500).json({ status: "error", message: "server_error" });
  }
};

const profileUpdation = async (req, res) => {
  const { id, git, linkedin, skills, name } = req.body;
  const file = req.file;

  try {
    if (file && file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        status: "error",
        message: "File size exceeds 5MB limit",
      });
    }

    if (git || linkedin) {
      const query = `
        SELECT github_link, linkedin_link
        FROM students
        WHERE (github_link = ? OR linkedin_link = ?)
        AND student_id != ?`;
      const result = await dbQuery(query, [git || "", linkedin || "", id]);

      const duplicates = {
        github: false,
        linkedin: false,
      };

      result.forEach((row) => {
        if (row.github_link === git && git) {
          duplicates.github = true;
        }
        if (row.linkedin_link === linkedin && linkedin) {
          duplicates.linkedin = true;
        }
      });

      if (duplicates.github || duplicates.linkedin) {
        return res.status(400).json({
          status: "error",
          message: "Duplicate links detected",
          duplicates,
        });
      }
    }

    const sqlUpdateStudent = `
      UPDATE students 
      SET github_link = ?, linkedin_link = ?, name = ?
      WHERE student_id = ?`;
    await dbQuery(sqlUpdateStudent, [git || null, linkedin || null, name || null, id]);

    if (skills) {
      const parsedSkills = JSON.parse(skills);

      const existingSkills = await dbQuery(
        "SELECT skill_id FROM student_skills WHERE student_id = ?",
        [id]
      );
      const existingSkillIds = existingSkills.map((s) => s.skill_id);
      const duplicateSkills = [];
      const newSkills = [];

      parsedSkills.forEach((skill, index) => {
        if (existingSkillIds.includes(skill.skillId)) {
          duplicateSkills.push({
            skillId: skill.skillId,
            skillName: skill.skillName,
            originalIndex: index,
          });
        } else {
          newSkills.push(skill);
        }
      });

      if (duplicateSkills.length > 0 && newSkills.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Skill_already_exists",
          duplicateSkills,
          partialSuccess: false,
        });
      }

      for (const skill of newSkills) {
        let skillId = skill.skillId;
        const isCustom = skillId === null;

        if (isCustom) {
          const [existingCustomSkill] = await dbQuery(
            "SELECT skill_id FROM skills WHERE skill_name = ?",
            [skill.skillName]
          );

          if (existingCustomSkill) {
            skillId = existingCustomSkill.skill_id;
          } else {
            const insertSkillResult = await dbQuery(
              "INSERT INTO skills (skill_name, skill_status) VALUES (?, ?)",
              [skill.skillName, 1]
            );
            skillId = insertSkillResult.insertId;
          }
        } else {
          const [existingSkill] = await dbQuery(
            "SELECT skill_id FROM skills WHERE skill_id = ?",
            [skillId]
          );
          if (!existingSkill) {
            return res.status(400).json({
              status: "error",
              message: `Skill with ID ${skillId} does not exist`,
            });
          }
        }

        await dbQuery(
          "INSERT INTO student_skills (student_id, skill_id, skill_url, skill_description) VALUES (?, ?, ?, ?)",
          [id, skillId, skill.projectUrl, skill.description]
        );
      }

      if (duplicateSkills.length > 0) {
        return res.json({
          status: "partial_success",
          message: "Some skills already exist",
          duplicateSkills,
          partialSuccess: true,
        });
      }
    }

    if (file) {
      const filename = file.filename;
      await dbQuery(
        "UPDATE students SET resume_file = ? WHERE student_id = ?",
        [filename, id]
      );
    }

    res.status(200).send("Profile updated successfully");
  } catch (error) {
    console.error("Error in profileUpdation:", error);
    res.status(500).json({
      status: "error",
      message: "student_catch_error",
      error: error.message,
    });
  }
};

const updateUserData = async (req, res) => {
  const { Name, Email, Password, Degree, Year, coll, id } = req.body;
  let Filename = null;

  try {
    if (req.file) {
      Filename = req.file.filename;
    }

    let sql =
      "UPDATE students SET name = ?, email = ?, password = ?, degree = ?, year = ?, college_id = ?";
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

const CheckEmailExists = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ status: "error", message: "Email is required" });
    }

    const sql = `SELECT COUNT(*) AS count FROM students WHERE email = ?`;
    const result = await dbQuery(sql, [email]);

    if (result[0].count > 0) {
      return res.json({ status: "success", exists: true });
    } else {
      return res.json({ status: "success", exists: false });
    }
  } catch (error) {
    console.error("Error in CheckEmailExists:", error);
    res.status(500).json({ status: "error", message: "server_error" });
  }
};

const ForgotPassword = async (req, res) => {
  const { Email } = req.body;

  try {
    const sql = `SELECT * FROM students WHERE email = ?`;
    const result = await dbQuery(sql, [Email]);

    if (result.length === 0) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const passkey = generatePasskey();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store passkey in password_reset_codes table
    await dbQuery(
      `INSERT INTO password_reset_codes (email, passkey, expires_at) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE passkey = ?, expires_at = ?, used = FALSE`,
      [Email, passkey, expiresAt, passkey, expiresAt]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sanjayravichandran006@gmail.com",
        pass: "lpzn amam wlgw kwdl",
      },
    });

    const mailOptions = {
      from: '"KGGL Gig" <sanjayravichandran006@gmail.com>',
      to: Email,
      subject: "Your Password Reset Code",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 40px; text-align: center;">
                <h1 style="color: #1a73e8; margin: 0 0 20px; font-size: 24px;">KGGL Gig</h1>
                <h2 style="color: #333; margin: 0 0 10px; font-size: 20px;">Password Reset Code</h2>
                <p style="color: #555; margin: 0 0 20px; font-size: 16px; line-height: 1.5;">
                  You have requested to reset your password. Please use the following 8-digit code to proceed with your password reset. This code is valid for 10 minutes.
                </p>
                <div style="background-color: #e8f0fe; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  <h3 style="color: #1a73e8; margin: 0; font-size: 24px; letter-spacing: 2px;">${passkey}</h3>
                </div>
                <p style="color: #555; margin: 0 0 20px; font-size: 14px; line-height: 1.5;">
                  If you did not request a password reset, please ignore this email or contact our support team.
                </p>
                <p style="color: #999; margin: 20px 0 0; font-size: 12px;">
                  © ${new Date().getFullYear()} KGGL Gig. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.send("mail_sended");
  } catch (error) {
    console.error("Error in ForgotPassword:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

const VerifyPasskey = async (req, res) => {
  const { email, passkey } = req.body;

  try {
    const sql = `
      SELECT * FROM password_reset_codes 
      WHERE email = ? AND passkey = ? AND used = FALSE AND expires_at > NOW()`;
    const result = await dbQuery(sql, [email, passkey]);

    if (result.length === 0) {
      return res.status(400).json({ status: "error", message: "Invalid or expired passkey" });
    }

    res.json({ status: "success", message: "Passkey verified" });
  } catch (error) {
    console.error("Error in VerifyPasskey:", error);
    res.status(500).json({ status: "error", message: "server_error" });
  }
};

const ResetPassword = async (req, res) => {
  const { email, passkey, password } = req.body;

  try {
    // Verify passkey
    const sqlVerify = `
      SELECT * FROM password_reset_codes 
      WHERE email = ? AND passkey = ? AND used = FALSE AND expires_at > NOW()`;
    const verifyResult = await dbQuery(sqlVerify, [email, passkey]);

    if (verifyResult.length === 0) {
      return res.status(400).json({ status: "error", message: "Invalid or expired passkey" });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({ status: "error", message: "Password must be at least 8 characters long" });
    }

    // Update password
    const sqlUpdate = `UPDATE students SET password = ? WHERE email = ?`;
    await dbQuery(sqlUpdate, [password, email]);

    // Mark passkey as used
    await dbQuery(
      `UPDATE password_reset_codes SET used = TRUE WHERE email = ? AND passkey = ?`,
      [email, passkey]
    );

    res.send("password_updated");
  } catch (error) {
    console.error("Error in ResetPassword:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

const StudentProjectDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT 
        p.project_id, 
        p.project_name, 
        p.description AS project_description, 
      
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


const getStudentDataAndTest = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT tr.*, tc.test_name FROM testresults tr JOIN testcreation tc ON tr.test_id = tc.test_id WHERE tr.student_id = ?";
    const query1 = "SELECT * FROM students WHERE student_id = ?";
    const query2 = "SELECT COUNT(skill_id) AS skillCount FROM student_skills WHERE student_id = ?";

    const [testResults, studentData, skillCountResult] = await Promise.all([
      dbQuery(query, [id]),
      dbQuery(query1, [id]),
      dbQuery(query2, [id]),
    ]);

    if (studentData.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    const response = {
      status: "success",
      student: studentData[0],
      testResults: testResults,
      skillCount: skillCountResult[0].skillCount,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve data",
    });
  }
};

const getAllStudentsDataAndTest = async (req, res) => {
  try {
    // Query to get all students
    const studentsQuery = "SELECT * FROM students WHERE role_id =2";
    // Query to get all test results with test names
    const testResultsQuery = "SELECT tr.*, tc.test_name FROM testresults tr JOIN testcreation tc ON tr.test_id = tc.test_id";
    // Query to get skill counts for all students
    const skillCountQuery = "SELECT student_id, COUNT(skill_id) AS skillCount FROM student_skills GROUP BY student_id";

    // Execute all queries concurrently
    const [studentsResult, testResultsResult, skillCountResult] = await Promise.all([
      dbQuery(studentsQuery),
      dbQuery(testResultsQuery),
      dbQuery(skillCountQuery),
    ]);

    // If no students found
    if (studentsResult.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No students found",
      });
    }

    // Map skill counts to student_id for efficient lookup
    const skillCountMap = {};
    skillCountResult.forEach((row) => {
      skillCountMap[row.student_id] = row.skillCount;
    });

    // Map test results to student_id for efficient lookup
    const testResultsMap = {};
    testResultsResult.forEach((test) => {
      if (!testResultsMap[test.student_id]) {
        testResultsMap[test.student_id] = [];
      }
      testResultsMap[test.student_id].push(test);
    });

    // Build response by combining data for each student
    const response = {
      status: "success",
      students: studentsResult.map((student) => ({
        student,
        testResults: testResultsMap[student.student_id] || [],
        skillCount: skillCountMap[student.student_id] || 0,
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in getAllStudentsDataAndTest:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve data",
    });
  }
};

const getBidCredits = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "SELECT name, credits FROM students WHERE student_id = ?";
    const result = await dbQuery(sql, [id]);

    if (result.length === 0) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    res.json({ name: result[0].name, bid_credits: result[0].credits });
  } catch (error) {
    console.error("Error in getBidCredits:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};

const updateBidCredits = async (req, res) => {
  const { id } = req.params;
  const { bid_credits } = req.body;
  try {
    const sql = "UPDATE students SET credits = ? WHERE student_id = ?";
    await dbQuery(sql, [bid_credits, id]);
    res.json({ status: true, msg: "Credits updated successfully" });
  } catch (error) {
    console.error("Error in updateBidCredits:", error);
    res.status(500).json({ status: "error", message: "student_catch_error" });
  }
};


const getRegisteredStudentsCount = async (req, res) => {
  try {
    const sql = "SELECT COUNT(*) AS totalStudents FROM students WHERE role_id = 2";
    const result = await dbQuery(sql);
    res.json({
      status: "success",
      totalStudents: result[0].totalStudents
    });
  } catch (error) {
    console.error("Error in getRegisteredStudentsCount:", error);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to retrieve student count" 
    });
  }
};


const getProjectsCount = async (req, res) => {
  try {
    // Query for total projects
    const totalProjectsQuery = "SELECT COUNT(*) AS totalProjects FROM projects";
    // Query for live projects (bit_status_id = 1 OR 11)
    const liveProjectsQuery = "SELECT COUNT(*) AS liveProjects FROM bit WHERE bit_status_id = 1 OR bit_status_id = 8 OR bit_status_id = 9 OR bit_status_id = 10 OR bit_status_id = 11";
    // Query for completed projects (bit_status_id = 12)
    const completedProjectsQuery = "SELECT COUNT(*) AS completedProjects FROM bit WHERE bit_status_id = 12";

    // Execute all queries concurrently
    const [totalResult, liveResult, completedResult] = await Promise.all([
      dbQuery(totalProjectsQuery),
      dbQuery(liveProjectsQuery),
      dbQuery(completedProjectsQuery),
    ]);

    // Log results for debugging
    console.log("Total Projects Query Result:", totalResult);
    console.log("Live Projects Query Result:", liveResult);
    console.log("Completed Projects Query Result:", completedResult);

    // Send response with all counts
    res.json({
      status: "success",
      totalProjects: totalResult[0].totalProjects,
      liveProjects: liveResult[0].liveProjects,
      completedProjects: completedResult[0].completedProjects,
    });
  } catch (error) {
    console.error("Error in getProjectsCount:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve projects count",
    });
  }
};


const getProjectsByStudentLevel = async (req, res) => {
  const { id } = req.params; // Get student_id from URL parameter

  try {
    // Validate student_id
    if (!id || isNaN(id)) {
      return res.status(400).json({ status: "error", message: "Invalid student ID" });
    }

    // Fetch the most recent test result for each skill
    const testResultsQuery = `
      SELECT tr.student_level, tr.test_id, tc.skill_id
      FROM testresults tr
      JOIN testcreation tc ON tr.test_id = tc.test_id
      WHERE tr.student_id = ?
      AND tr.student_level IN ('Easy', 'Medium', 'Hard')
      AND (tr.test_id, tc.skill_id) IN (
        SELECT tr2.test_id, tc2.skill_id
        FROM testresults tr2
        JOIN testcreation tc2 ON tr2.test_id = tc2.test_id
        WHERE tr2.student_id = ?
        AND tr2.attend_at = (
          SELECT MAX(tr3.attend_at)
          FROM testresults tr3
          JOIN testcreation tc3 ON tr3.test_id = tc3.test_id
          WHERE tc3.skill_id = tc2.skill_id
          AND tr3.student_id = ?
        )
      )
      ORDER BY tr.attend_at DESC`;
    const testResults = await dbQuery(testResultsQuery, [id, id, id]);

    // If no passed test results found
    if (testResults.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No passed tests found. Please pass a test to view projects.",
      });
    }

    // Map passed tests to level_id and skill_id
    const levelSkills = [];
    for (const test of testResults) {
      const { student_level, skill_id } = test;

      // Fetch level_id from difficultylevels
      const levelQuery = `
        SELECT level_id 
        FROM difficultylevels 
        WHERE level_name = ?`;
      const levelResult = await dbQuery(levelQuery, [student_level]);

      if (levelResult.length === 0) {
        continue; // Skip if no level found
      }

      const level_id = levelResult[0].level_id;
      levelSkills.push({ level_id, skill_id });
    }

    // If no valid level-skill pairs found
    if (levelSkills.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No valid levels found for passed tests.",
      });
    }

    // Fetch projects for all passed tests' level_id and skill_id
    const projectsQuery = `
      SELECT project_id, project_name, description, created_at, expiry_date 
      FROM projects 
      WHERE (${levelSkills
        .map(() => `(level_id = ? AND stack = ?)`)
        .join(' OR ')})`;
    const projectsParams = levelSkills.flatMap(({ level_id, skill_id }) => [level_id, skill_id]);
    const projects = await dbQuery(projectsQuery, projectsParams);

    // If no projects found
    if (projects.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No projects available for your most recent test levels and skills",
      });
    }

    // Return the projects
    res.json({
      status: "success",
      projects,
    });
  } catch (error) {
    console.error("Error in getProjectsByStudentLevel:", error);
    res.status(500).json({ status: "error", message: "server_error" });
  }
};






const GetTechnicalStatusByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Query to join students and course tables using email
    const query = `
      SELECT c.technical_status 
      FROM students s
      JOIN course c ON s.degree = c.course_id
      WHERE s.email = ?`;
    
    const result = await dbQuery(query, [email]);

    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Student or course not found"
      });
    }

    res.status(200).json({
      status: "success",
      technical_status: result[0].technical_status
    });
  } catch (error) {
    console.error("Error in GetTechnicalStatusByEmail:", error);
    res.status(500).json({
      status: "error",
      message: "server_error",
      error: error.message
    });
  }
};

export {

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
  getStudentDataAndTest,
  getBidCredits,
  updateBidCredits,
  checkDuplicateLinks,
  VerifyPasskey,
  CheckEmailExists,
  getRegisteredStudentsCount,
  getProjectsCount,
  getAllStudentsDataAndTest,
  getProjectsByStudentLevel,
  GetTechnicalStatusByEmail
};
