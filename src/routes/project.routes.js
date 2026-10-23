import { Router } from "express";

import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/project.controller.js";

export const projectRouter = Router();

projectRouter.post("/project", createProject);

projectRouter.get("/project", getAllProjects);

projectRouter.get("/project/:id", getProjectById);

projectRouter.put("/project/:id", updateProject);

projectRouter.delete("/project/:id", deleteProject);
