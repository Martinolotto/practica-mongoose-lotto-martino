import { DepartmentModel } from "../models/department.model.js";

//Crear departamentos
export const createDepartment = async (req, res) => {
  try {
    //desestructuracion del body
    const { name, location } = req.body;

    const newDepartment = await DepartmentModel.create({
      name,
      location,
    });

    return res.status(201).json({
      msg: "Departamento creado correctamente",
      data: newDepartment,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//obtener todos
export const getAllDepartments = async (req, res) => {
  try {
    //busca en el modelo
    // Buscamos departamentos que no estén eliminados.
    const departments = await DepartmentModel.find({
      isDeleted: { $ne: true },
    });

    return res.status(200).json({
      msg: "Lista de Departamentos",
      departments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//obtener por id
export const getDepartmentById = async (req, res) => {
  try {
    //id desde el param
    const { id } = req.params;

    //metodo2, virtual populate, con cambios en el modelo
    //recorrido inverso al populate, sin referenciar directamente en el modelo a las tareas.
    //consultar las employees desde departments

    // Buscamos el departamento por ID, siempre que no esté eliminado.
    const department = await DepartmentModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    }).populate({
      path: "employees", // Relación virtual de Department
      select: "name department", // Datos del empleado que mostramos
      //condicion que se aplica a los documentos relacionados que trae populate
      match: { isDeleted: { $ne: true } }, // Solo empleados activos
    });

    if (!department) {
      return res.status(404).json({
        msg: "Departamento no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Departamento encontrado",
      data: department,
      //cuando repondemos con json, el toJSON: { virtuals: true del modelo permite incluir esta propiedad
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//actualizar department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    //objeto con campos que se van a actualizar
    const updates = {};

    // Solo agregamos los campos que se enviaron
    if (name !== undefined) updates.name = name;
    if (location !== undefined) updates.location = location;

    // Evitamos ejecutar una actualización sin datos
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        msg: "No se enviaron campos para actualizar",
      });
    }

    // Solo actualizamos si el departamento sigue activo.
    const updatedDepartment = await DepartmentModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } }, // Condiciones para encontrarlo
      updates, // Campos que enviamos en el PUT
      {
        returnDocument: "after", // Devolver los valores actualizados
        runValidators: true, // Aplicar validaciones del Schema
      },
    );

    if (!updateDepartment) {
      return res.status(404).json({
        msg: "Departamento no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Departamento actualizado correctamente",
      data: updateDepartment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

import { EmployeeModel } from "../models/employee.model.js";
//borrar Departamento
export const deleteDepartment = async (req, res) => {
  try {
    //Obtener el id desde params
    const { id } = req.params;

    // Primero comprobamos que el departamento exista y esté activo.
    const department = await DepartmentModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!department) {
      return res.status(404).json({
        msg: "Departamento no encontrado",
      });
    }

    // Contamos cuántos empleados activos pertenecen al departamento.
    const activeEmployees = await EmployeeModel.countDocuments({
      department: id,
      isDeleted: { $ne: true },
    });

    // Si todavía tiene empleados activos, no permitimos eliminarlo.
    if (activeEmployees > 0) {
      return res.status(409).json({ //conflict
        msg: "No se puede eliminar un departamento con empleados activos",
      });
    }

    // Si no tiene empleados activos, lo marcamos como eliminado.
    const deletedDepartment = await DepartmentModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { returnDocument: "after" },
    );

    if (!deletedDepartment) {
      return res.status(404).json({
        msg: "Departamento no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Departamento eliminado correctamente",
      data: deletedDepartment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};