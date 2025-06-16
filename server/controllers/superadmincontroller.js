import db from "../config/db.js";

const getAllAdmins = async (req, res) => {
  try {
    const sql = `SELECT student_id, name, email FROM students WHERE role_id = 1`;
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

const getPermissions = async (req, res) => {
  try {
    const sql = `
      SELECT ap.spad_id, ap.admin_id, m.menu_name, ap.is_allow
      FROM admin_permission ap
      JOIN menus m ON ap.menu_id = m.menu_id
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

const getMenus = async (req, res) => {
  try {
    const sql = `SELECT menu_id, menu_name FROM menus`;
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

const updatePermissions = async (req, res) => {
  const { spad_id } = req.params;
  const { permissions } = req.body;

  if (!spad_id || isNaN(parseInt(spad_id))) {
    return res.status(400).json({ status: false, msg: "Invalid or missing spad_id" });
  }

  if (!permissions || typeof permissions !== "object") {
    return res.status(400).json({ status: false, msg: "Invalid input: permissions are required" });
  }

  try {
    db.query("START TRANSACTION", async (err) => {
      if (err) {
        console.error("Transaction start error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }

      try {
        const getMenusSql = "SELECT menu_id, menu_name FROM menus";
        db.query(getMenusSql, async (err, menus) => {
          if (err) {
            console.error("Error fetching menus:", err);
            db.query("ROLLBACK");
            return res.status(500).json({ status: false, msg: "db_error" });
          }

          const adminIds = Object.keys(permissions);
          for (const admin_id of adminIds) {
            const selectedMenus = permissions[admin_id] || [];

            for (const menu of menus) {
              const is_allow = selectedMenus.includes(menu.menu_name) ? 1 : 0;

              const checkSql = `
                SELECT COUNT(*) AS count
                FROM admin_permission
                WHERE spad_id = ? AND admin_id = ? AND menu_id = ?
              `;
              const checkResult = await new Promise((resolve, reject) => {
                db.query(checkSql, [spad_id, admin_id, menu.menu_id], (err, result) => {
                  if (err) return reject(err);
                  resolve(result[0].count);
                });
              });

              if (checkResult > 0) {
                const updateSql = `
                  UPDATE admin_permission
                  SET is_allow = ?
                  WHERE spad_id = ? AND admin_id = ? AND menu_id = ?
                `;
                await new Promise((resolve, reject) => {
                  db.query(updateSql, [is_allow, spad_id, admin_id, menu.menu_id], (err) => {
                    if (err) return reject(err);
                    resolve();
                  });
                });
              } else {
                const insertSql = `
                  INSERT INTO admin_permission (spad_id, admin_id, menu_id, is_allow)
                  VALUES (?, ?, ?, ?)
                `;
                await new Promise((resolve, reject) => {
                  db.query(insertSql, [spad_id, admin_id, menu.menu_id, is_allow], (err) => {
                    if (err) return reject(err);
                    resolve();
                  });
                });
              }
            }
          }

          db.query("COMMIT", (err) => {
            if (err) {
              console.error("Transaction commit error:", err);
              db.query("ROLLBACK");
              return res.status(500).json({ status: false, msg: "db_error" });
            }
            res.json({ status: true, msg: "Permissions updated successfully" });
          });
        });
      } catch (err) {
        console.error("Error processing permissions:", err);
        db.query("ROLLBACK");
        return res.status(500).json({ status: false, msg: "db_error" });
      }
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
};



const getAllProjects = async (req, res) => {
  try {
    const sql = `
      SELECT p.project_id, p.project_name,p.client_name, p.description, p.stack, s.skill_name AS skill_name, 
             p.created_at, p.expiry_date, p.level_id, p.number_of_students, p.created_by, 
             st.name AS created_by_name, p.total_amount
      FROM projects p
      LEFT JOIN skills s ON p.stack = s.skill_id
      LEFT JOIN students st ON p.created_by = st.student_id
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

const getAllSkills = async (req, res) => {
  try {
    const sql = `SELECT skill_id, skill_name FROM skills`;
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



const updateProject = async (req, res) => {
  const { project_id } = req.params;
  const { project_name, description, stack, expiry_date, level_id, number_of_students, total_amount, client_name } = req.body;

  try {
    const updates = [];
    const values = [];

    if (project_name !== undefined) {
      updates.push("project_name = ?");
      values.push(project_name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (stack !== undefined) {
      updates.push("stack = ?");
      values.push(stack);
    }
    if (expiry_date !== undefined) {
      updates.push("expiry_date = ?");
      values.push(expiry_date);
    }
    if (level_id !== undefined) {
      updates.push("level_id = ?");
      values.push(level_id);
    }
    if (number_of_students !== undefined) {
      updates.push("number_of_students = ?");
      values.push(number_of_students);
    }
    if (total_amount !== undefined) {
      updates.push("total_amount = ?");
      values.push(total_amount);
    }
    if (client_name !== undefined) {
      updates.push("client_name = ?");
      values.push(client_name);
    }

    if (updates.length === 0) {
      return res.status(400).json({ status: false, msg: "No fields provided for update" });
    }

    const sql = `
      UPDATE projects
      SET ${updates.join(", ")}
      WHERE project_id = ?
    `;
    values.push(project_id);

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, msg: "Project not found" });
      }
      res.json({ status: true, msg: "Project updated successfully" });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
};

const deleteProject = async (req, res) => {
  const { project_id } = req.params;

  try {
    const sql = `DELETE FROM projects WHERE project_id = ?`;
    db.query(sql, [project_id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: false, msg: "db_error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, msg: "Project not found" });
      }
      res.json({ status: true, msg: "Project deleted successfully" });
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ status: false, msg: "server_error" });
  }
};

export { getAllAdmins, getPermissions, getMenus, updatePermissions, getAllProjects, updateProject, deleteProject , getAllSkills };