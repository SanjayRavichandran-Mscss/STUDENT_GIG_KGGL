import db from "../config/db.js";

const getCourseDetails = async (req, res) => {
  const { id } = req.params;

  try {
    let sql = `SELECT course_id, course_name
    FROM course
    WHERE college_id = ${id}`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        res.json({ msg: "db_error" });
      } else {
        res.json({ result });
      }
    });
  } catch (e) {
    res.send("college_catch_error");
  }
};

const getCourseYear = async (req, res) => {
  const { id } = req.params;

  try {
    let sql = `SELECT course_id, course_name, years
    FROM course
    WHERE course_id = ${id}`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        res.json({ msg: "db_error" });
      } else {
        res.json({ result });
      }
    });
  } catch (e) {
    res.send("college_catch_error");
  }
};

const GetCollegeDetail = async (req, res) => {
  try {
    let getcollege = "select * from colleges";
    db.query(getcollege, (error, result) => {
      if (error) {
        // console.log(error)
        res.json({ status: false, msg: "error" });
      } else {
        res.json({ status: true, msg: result });
      }
    });
  } catch (e) {
    res.send("college_catch_error");
  }
};

const Skills = async (req, res) => {
  try {
    let getSkills = "select * from skills";
    db.query(getSkills, (err, result) => {
      if (err) {
        res.json({ status: false, msg: "error" });
      } else {
        res.json({ status: true, msg: result });
      }
    });
  } catch (e) {
    res.send("college_catch_error");
  }
};

export { GetCollegeDetail, Skills, getCourseDetails, getCourseYear };

















































