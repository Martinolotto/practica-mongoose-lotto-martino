import { body, param } from "express-validator";
import { ProjectModel } from "../models/project.model.js";

// Crear proyecto
export const createProjectValidations = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("status")
    .optional() // El Schema ya tiene "planning" por defecto.
    .isIn(["planning", "in_progress", "finished"])
    .withMessage("Estado de proyecto inválido"),

  // Nuevo: validamos que el arreglo tenga al menos un elemento.
  body("milestones")
    .isArray({ min: 1 })
    .withMessage("El proyecto debe tener al menos un hito"),

  // El * permite validar el name de cada hito embebido.
  body("milestones.*.name")
    .isString()
    .withMessage("El nombre del hito debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre del hito es obligatorio"),

  body("milestones.*.completed")
    .optional() // El Schema tiene false por defecto.
    .isBoolean()
    .withMessage("completed debe ser booleano"),
];

// Obtener proyecto por ID
export const getProjectByIdValidations = [
  param("id")
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

// Actualizar proyecto
export const updateProjectValidations = [
  ...getProjectByIdValidations,

  body("name")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),

  body("status")
    .optional()
    .isIn(["planning", "in_progress", "finished"])
    .withMessage("Estado de proyecto inválido"),

  // En PUT es opcional actualizar los hitos.
  // Si llega el arreglo, debe contener al menos uno.
  body("milestones")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Debe haber al menos un hito"),

  body("milestones.*.name")
    .isString()
    .withMessage("El nombre del hito debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre del hito es obligatorio"),

  body("milestones.*.completed")
    .optional()
    .isBoolean()
    .withMessage("completed debe ser booleano"),
];

// Eliminar proyecto
export const deleteProjectValidations = getProjectByIdValidations;
