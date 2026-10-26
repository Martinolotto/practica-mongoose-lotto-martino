import { body, param } from "express-validator";
import { DepartmentModel } from "../models/department.model.js";

// Crear departamento
export const createDepartmentValidations = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    // Igual que con Sequelize: comprobamos que no esté repetido.
    .custom(async (name) => {
      // Mongoose: no usamos where: { name }.
      const department = await DepartmentModel.findOne({ name });

      if (department) {
        throw new Error("El departamento ya existe");
      }

      return true;
    }),

  body("location")
    .isString()
    .withMessage("La ubicación debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("La ubicación es obligatoria"),
];

// Obtener departamento por ID
export const getDepartmentByIdValidations = [
  param("id")
    .isMongoId()
    .withMessage("El ID debe ser un ObjectId válido")
    .bail() // Evita buscar en MongoDB si el formato es incorrecto.
    .custom(async (id) => {
      // Sequelize: findByPk(id).
      // Mongoose: findOne permite agregar el filtro isDeleted.
      const department = await DepartmentModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!department) {
        throw new Error("El departamento no existe o está eliminado");
      }

      return true;
    }),
];

// Actualizar departamento
export const updateDepartmentValidations = [
  // Reutilizamos la validación del ID.
  ...getDepartmentByIdValidations,

  body("name")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .custom(async (name, { req }) => {
      const department = await DepartmentModel.findOne({ name });

      // En Mongoose comparamos ObjectIds convertidos a texto.
      // No usamos Number(req.params.id), como con Sequelize.
      if (department && department._id.toString() !== req.params.id) {
        throw new Error("El nombre ya está registrado");
      }

      return true;
    }),

  body("location")
    .optional()
    .isString()
    .withMessage("La ubicación debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("La ubicación no puede estar vacía"),
];

// Eliminar departamento
// Es la misma comprobación de ID que usamos en GET.
export const deleteDepartmentValidations = getDepartmentByIdValidations;
