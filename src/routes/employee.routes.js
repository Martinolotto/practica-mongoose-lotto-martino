import { Router } from "express";
import { validate } from "../middlewares/validate.js";

import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  addProjectToEmployee
} from "../controllers/employee.controller.js";

import {
  createEmployeeValidations,
  getEmployeeByIdValidations,
  updateEmployeeValidations,
  deleteEmployeeValidations,
  addProjectToEmployeeValidations,
} from "../middlewares/employee.validation.js";

export const employeeRouter = Router();

employeeRouter.post(
  "/employee",
  createEmployeeValidations,
  validate,
  createEmployee,
);

employeeRouter.get("/employee", getAllEmployees);

employeeRouter.get(
  "/employee/:id",
  getEmployeeByIdValidations,
  validate,
  getEmployeeById,
);

employeeRouter.put(
  "/employee/:id",
  updateEmployeeValidations,
  validate,
  updateEmployee,
);

employeeRouter.delete(
  "/employee/:id",
  deleteEmployeeValidations,
  validate,
  deleteEmployee,
);

// Agregar un proyecto a un empleado (relación N:M).
employeeRouter.post(
  "/employee/:id/projects/:projectId",
  addProjectToEmployeeValidations,
  validate,
  addProjectToEmployee,
);