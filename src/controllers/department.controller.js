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
    const departments = await DepartmentModel.find();

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
    const department = await DepartmentModel.findById(id)
      .populate("employees","name department") //usa la relacion virtual

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

    const updateDepartment = await DepartmentModel.findByIdAndUpdate(
      //busca coincidencia
      id,
      updates,
      //para que muestre todos los datos despues de actualizar
      //after mostramos lo ultimo que se actualizo, before muestra antes de actualizarse
      {
        returnDocument: "after", 
        runValidators: true,
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

//borrar Departamento
export const deleteDepartment = async (req, res) => {
  try {
    //Obtener el id desde params
    const { id } = req.params;

    // Buscar y eliminar el documento por id
    const deletedDepartment = await DepartmentModel.findByIdAndDelete(id);

    // otra forma:
    // const deletedUser2 = await UserModel.deleteOne({ _id: id });

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