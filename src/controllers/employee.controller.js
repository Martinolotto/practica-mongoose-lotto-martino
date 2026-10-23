import { EmployeeModel } from "../models/employee.model.js";

//Crear empleado
export const createEmployee = async (req, res) => {
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
        .populate("department", "name location") //Referencia directa 1:N
        .populate("projects", "name status") // Referencia directa N:M
        .populate("contract") // referencia virtual 1:1

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
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, projects } = req.body;

    //objeto con campos que se van a actualizar
    const updates = {};

    // Solo agregamos los campos que se enviaron
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (department !== undefined) updates.department = department;
    if (projects !== undefined) updates.projects = projects;

    // Evitamos ejecutar una actualización sin datos
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        msg: "No se enviaron campos para actualizar",
      });
    }

    const updateEmployee = await EmployeeModel.findByIdAndUpdate(
      //busca coincidencia
        id,
        updates,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updateEmployee) {
      return res.status(404).json({
        msg: "Empleado no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Empleado actualizado correctamente",
      data: updateEmployee,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//borrar Departamento
export const deleteEmployee = async (req, res) => {
  try {
    //Obtener el id desde params
    const { id } = req.params;

    // Buscar y eliminar el documento por id
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);

    // otra forma:
    // const deletedUser2 = await UserModel.deleteOne({ _id: id });

    if (!deletedEmployee) {
      return res.status(404).json({
        msg: "Empleado no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Empleado eliminado correctamente",
      data: deletedEmployee,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};
