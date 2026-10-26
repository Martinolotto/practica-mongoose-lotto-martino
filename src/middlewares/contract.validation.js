import { body, param } from "express-validator";

import { ContractModel } from "../models/contract.model.js";
import { EmployeeModel } from "../models/employee.model.js";

// Crear contrato
export const createContractValidations = [
  body("employee")
    .isMongoId()
    .withMessage("ID de empleado inválido")
    .bail()
    .custom(async (id) => {
      // Antes con Sequelize: UserModel.findByPk(user_id).
      // Ahora buscamos por _id y verificamos que no esté eliminado.
      const employee = await EmployeeModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!employee) {
        throw new Error("El empleado no existe o está eliminado");
      }

      return true;
    })
    .custom(async (id) => {
      // Relación 1:1: un empleado solo puede tener un contrato.
      const contract = await ContractModel.findOne({ employee: id });

      if (contract) {
        throw new Error("El empleado ya tiene un contrato");
      }

      return true;
    }),

  body("type")
    .isString()
    .withMessage("El tipo debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El tipo de contrato es obligatorio"),

  body("startDate")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha debe tener formato válido"),
];

// Obtener contrato por ID
export const getContractByIdValidations = [
  param("id")
    .isMongoId()
    .withMessage("ID de contrato inválido")
    .bail()
    .custom(async (id) => {
      const contract = await ContractModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!contract) {
        throw new Error("El contrato no existe o está eliminado");
      }

      return true;
    }),
];

// Actualizar contrato
export const updateContractValidations = [
  ...getContractByIdValidations,

  body("employee")
    .optional()
    .isMongoId()
    .withMessage("ID de empleado inválido")
    .bail()
    .custom(async (id, { req }) => {
      const employee = await EmployeeModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!employee) {
        throw new Error("El empleado no existe o está eliminado");
      }

      // Comprobamos que el contrato no pertenezca a otro registro.
      const contract = await ContractModel.findOne({ employee: id });

      if (contract && contract._id.toString() !== req.params.id) {
        throw new Error("El empleado ya tiene un contrato");
      }

      return true;
    }),

  body("type")
    .optional()
    .isString()
    .withMessage("El tipo debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El tipo no puede estar vacío"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener formato válido"),
];

// Eliminar contrato
export const deleteContractValidations = getContractByIdValidations;
