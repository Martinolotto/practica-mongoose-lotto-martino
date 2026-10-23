import { Router } from "express";

import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../controllers/employee.controller.js";

export const employeeRouter = Router();

employeeRouter.post("/employee", createEmployee);

employeeRouter.get("/employee", getAllEmployees);

employeeRouter.get("/employee/:id", getEmployeeById);

employeeRouter.put("/employee/:id", updateEmployee);

employeeRouter.delete("/employee/:id", deleteEmployee);
