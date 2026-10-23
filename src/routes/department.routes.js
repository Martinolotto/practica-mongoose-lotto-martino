import { Router } from "express";

import {
    createDepartment,
    deleteDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment
} from "../controllers/department.controller.js";

export const departmentRouter = Router();

departmentRouter.post("/department", createDepartment);

departmentRouter.get("/department", getAllDepartments);

departmentRouter.get("/department/:id", getDepartmentById);

departmentRouter.put("/department/:id", updateDepartment);

departmentRouter.delete("/department/:id", deleteDepartment);
