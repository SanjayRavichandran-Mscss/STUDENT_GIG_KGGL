import db from "../config/db.js";

const getAllAdmins = async (req, res) => {
  try {
    const sql = `SELECT * FROM students WHERE role_id = 1`;
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
    const sql = `SELECT * FROM menus`;
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

              // Check if permission record exists
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
                // Update existing record
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
                // Insert new record
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



export { getAllAdmins, getPermissions, getMenus, updatePermissions };