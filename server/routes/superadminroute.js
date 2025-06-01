import express from "express";
import { getAllAdmins, getPermissions, getMenus, updatePermissions } from "../controllers/superadmincontroller.js";

const superadminRouter = express.Router();

superadminRouter.route("/getalladmins").get(getAllAdmins);
superadminRouter.route("/getpermissions").get(getPermissions);
superadminRouter.route("/getmenus").get(getMenus);
superadminRouter.route("/updatepermissions/:spad_id").post(updatePermissions);

export default superadminRouter;