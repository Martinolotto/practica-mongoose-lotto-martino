import { body, param } from "express-validator";

import { EmployeeModel } from "../models/employee.model.js";
import { DepartmentModel } from "../models/department.model.js";
import { ProjectModel } from "../models/project.model.js";

// Crear empleado
export const createEmployeeValidations = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("email")
    .isEmail()
    .withMessage("El email debe ser válido")
    .bail()
    .custom(async (email) => {
      // Como en Sequelize, comprobamos que no esté repetido.
      // Cambia la consulta: no usamos where.
      const employee = await EmployeeModel.findOne({ email });

      if (employee) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  body("department")
    .isMongoId()
    .withMessage("ID de departamento inválido")
    .bail()
    .custom(async (id) => {
      // ref: "Department" no comprueba que el ID exista.
      // Por eso lo buscamos manualmente con Mongoose.
      const department = await DepartmentModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!department) {
        throw new Error("El departamento no existe o está eliminado");
      }

      return true;
    }),

  // projects es un arreglo de ObjectIds, no una tabla intermedia.
  body("projects")
    .optional()
    .isArray()
    .withMessage("projects debe ser un arreglo")
    .bail()
    .custom((projects) => {
      // Comprobamos que el arreglo no contenga IDs repetidos.
      const ids = projects.map((id) => String(id).toLowerCase());

      if (new Set(ids).size !== ids.length) {
        throw new Error("No se permiten proyectos repetidos");
      }

      return true;
    }),

  // Validamos cada ObjectId que viene dentro del arreglo.
  body("projects.*")
    .isMongoId()
    .withMessage("ID de proyecto inválido")
    .bail()
    .custom(async (id) => {
      const project = await ProjectModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!project) {
        throw new Error("El proyecto no existe o está eliminado");
      }

      return true;
    }),
];

// Obtener empleado por ID
export const getEmployeeByIdValidations = [
  param("id")
    .isMongoId()
    .withMessage("ID de empleado inválido")
    .bail()
    .custom(async (id) => {
      const employee = await EmployeeModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!employee) {
        throw new Error("El empleado no existe o está eliminado");
      }

      return true;
    }),
];

// Actualizar empleado
export const updateEmployeeValidations = [
  ...getEmployeeByIdValidations,

  body("name")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("El email debe ser válido")
    .bail()
    .custom(async (email, { req }) => {
      const employee = await EmployeeModel.findOne({ email });

      // A diferencia de Sequelize, _id es un ObjectId.
      // Lo convertimos a texto para compararlo con el param.
      if (employee && employee._id.toString() !== req.params.id) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  body("department")
    .optional()
    .isMongoId()
    .withMessage("ID de departamento inválido")
    .bail()
    .custom(async (id) => {
      const department = await DepartmentModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!department) {
        throw new Error("El departamento no existe o está eliminado");
      }

      return true;
    }),

  body("projects")
    .optional()
    .isArray()
    .withMessage("projects debe ser un arreglo")
    .bail()
    .custom((projects) => {
      const ids = projects.map((id) => String(id).toLowerCase());

      if (new Set(ids).size !== ids.length) {
        throw new Error("No se permiten proyectos repetidos");
      }

      return true;
    }),

  body("projects.*")
    .isMongoId()
    .withMessage("ID de proyecto inválido")
    .bail()
    .custom(async (id) => {
      const project = await ProjectModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!project) {
        throw new Error("El proyecto no existe o está eliminado");
      }

      return true;
    }),
];

// Eliminar empleado
export const deleteEmployeeValidations = getEmployeeByIdValidations;

// Endpoint N:M: agregar un proyecto a un empleado.
export const addProjectToEmployeeValidations = [
  ...getEmployeeByIdValidations,

  param("projectId")
    .isMongoId()
    .withMessage("ID de proyecto inválido")
    .bail()
    .custom(async (id) => {
      const project = await ProjectModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!project) {
        throw new Error("El proyecto no existe o está eliminado");
      }

      return true;
    }),

  // No repetimos la comprobación de vínculo duplicado:
  // nuestro controlador ya responde 409 cuando existe.
];
