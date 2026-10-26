import { Router } from "express";
import { validate } from "../middlewares/validate.js";

import {
  createContract,
  deleteContract,
  getAllContracts,
  getContractById,
  updateContract,
} from "../controllers/contract.controller.js";

import {
  createContractValidations,
  getContractByIdValidations,
  updateContractValidations,
  deleteContractValidations,
} from "../middlewares/contract.validation.js";

export const contractRouter = Router();
contractRouter.post(
  "/contract",
  createContractValidations,
  validate,
  createContract,
);

contractRouter.get("/contract", getAllContracts);

contractRouter.get(
  "/contract/:id",
  getContractByIdValidations,
  validate,
  getContractById,
);

contractRouter.put(
  "/contract/:id",
  updateContractValidations,
  validate,
  updateContract,
);

contractRouter.delete(
  "/contract/:id",
  deleteContractValidations,
  validate,
  deleteContract,
);