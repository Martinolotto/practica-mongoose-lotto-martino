import { Router } from "express";

import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  addProjectToEmployee
} from "../controllers/employee.controller.js";

export const employeeRouter = Router();

employeeRouter.post("/employee", createEmployee);

employeeRouter.get("/employee", getAllEmployees);

employeeRouter.get("/employee/:id", getEmployeeById);

employeeRouter.put("/employee/:id", updateEmployee);

employeeRouter.delete("/employee/:id", deleteEmployee);

// Agregar un proyecto a un empleado (relación N:M).
employeeRouter.post(
  "/employee/:id/projects/:projectId",
  addProjectToEmployee
);