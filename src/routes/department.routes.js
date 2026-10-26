import { Router } from "express";
import { validate } from "../middlewares/validate.js";

import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "../controllers/department.controller.js";

import {
  createDepartmentValidations,
  getDepartmentByIdValidations,
  updateDepartmentValidations,
  deleteDepartmentValidations,
} from "../middlewares/department.validator.js";

export const departmentRouter = Router();

departmentRouter.post(
  "/department",
  createDepartmentValidations,
  validate,
  createDepartment,
);

departmentRouter.get("/department", getAllDepartments);

departmentRouter.get(
  "/department/:id",
  getDepartmentByIdValidations,
  validate,
  getDepartmentById,
);

departmentRouter.put(
  "/department/:id",
  updateDepartmentValidations,
  validate,
  updateDepartment,
);

departmentRouter.delete(
  "/department/:id",
  deleteDepartmentValidations,
  validate,
  deleteDepartment,
);