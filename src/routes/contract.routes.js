import { Router } from "express";

import {
  createContract,
  deleteContract,
  getAllContracts,
  getContractById,
  updateContract,
} from "../controllers/contract.controller.js";

export const contractRouter = Router();

contractRouter.post("/contract", createContract);

contractRouter.get("/contract", getAllContracts);

contractRouter.get("/contract/:id", getContractById);

contractRouter.put("/contract/:id", updateContract);

contractRouter.delete("/contract/:id", deleteContract);
