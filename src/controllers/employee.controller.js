import { EmployeeModel } from "../models/employee.model.js";

//Crear empleado
export const createEmployer = async (req, res) => {
  try {
    //desestructuracion del body
    const { name, email, department, projects } = req.body;

    const newEmployee = await EmployeeModel.create({
      name,
      email,
      department,
      projects,
    });

    return res.status(201).json({
      msg: "Empleado creado correctamente",
      data: newEmployee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//obtener todos
export const getAllEmployees = async (req, res) => {
  try {
    //busca en el modelo
    const employees = await EmployeeModel.find();

    return res.status(200).json({
      msg: "Lista de Empleados",
      employees,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//obtener por id
export const getEmployeeById = async (req, res) => {
  try {
    //id desde el param
      const { id } = req.params;

//por cada empledo mostramos su departamento, proyecto y contrato
      const employee = await EmployeeModel.findById(id)
        .populate("department", "name location")
        .populate("projects", "name status")
        .populate("contract")

    if (!employee) {
      return res.status(404).json({
        msg: "Empleado no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Empleado encontrado",
      data: employee,
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
    const { name, email, department, projects } = req.body;

    //objeto con campos que se van a actualizar
    const updates = {};

    // Solo agregamos los campos que se enviaron
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (department !== undefined) updates.department = department;
    if (email !== undefined) updates.projects = projects;

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
