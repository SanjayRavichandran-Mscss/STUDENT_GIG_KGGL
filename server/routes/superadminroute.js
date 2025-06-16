import express from "express";
import { getAllAdmins, getPermissions, getMenus, updatePermissions,updateProject,getAllProjects,getAllSkills, deleteProject } from "../controllers/superadmincontroller.js";

const superadminRouter = express.Router();

superadminRouter.route("/getalladmins").get(getAllAdmins);
superadminRouter.route("/getpermissions").get(getPermissions);
superadminRouter.route("/getmenus").get(getMenus);
superadminRouter.route("/updatepermissions/:spad_id").post(updatePermissions);
superadminRouter.route("/updateproject/:project_id").put(updateProject);
superadminRouter.route("/getallprojects").get(getAllProjects);
superadminRouter.route("/deleteproject/:project_id").delete(deleteProject);
superadminRouter.route("/getallskills").get(getAllSkills);

export default superadminRouter;