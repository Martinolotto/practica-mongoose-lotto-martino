import { Router } from "express";
import { validate } from "../middlewares/validate.js";

import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/project.controller.js";

import {
  createProjectValidations,
  getProjectByIdValidations,
  updateProjectValidations,
  deleteProjectValidations,
} from "../middlewares/project.validation.js";

export const projectRouter = Router();

projectRouter.post(
  "/project",
  createProjectValidations,
  validate,
  createProject,
);

projectRouter.get("/project", getAllProjects);

projectRouter.get(
  "/project/:id",
  getProjectByIdValidations,
  validate,
  getProjectById,
);

projectRouter.put(
  "/project/:id",
  updateProjectValidations,
  validate,
  updateProject,
);

projectRouter.delete(
  "/project/:id",
  deleteProjectValidations,
  validate,
  deleteProject,
);