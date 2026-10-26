import { EmployeeModel } from "../models/employee.model.js";
// Lo necesitamos para dar de baja el contrato del empleado.
import { ContractModel } from "../models/contract.model.js";
//endpoint N:M para poder agregar un elemento, proyecto al arreglo solo si no existe.
import { ProjectModel } from "../models/project.model.js";

//Crear empleado
export const createEmployee = async (req, res) => {
  try {
    //desestructuracion del body
    const { name, email, department, projects } = matchedData(req, {
      locations: ["body"],
    });

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
    // Traemos solamente los empleados no eliminados.
    const employees = await EmployeeModel.find({
      isDeleted: { $ne: true },
    });

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
    // Buscamos un empleado activo por su ID.
    const employee = await EmployeeModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    })
      .populate("department", "name location") //Referencia directa 1:N
      .populate("projects", "name status") // Referencia directa N:M
      .populate({
        path: "contract", // Relación virtual 1:1
        match: { isDeleted: { $ne: true } }, // No traer contratos eliminados
      });

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
const { name, email, department, projects } = matchedData(req, {
  locations: ["body"],
});

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

    // Actualizamos solamente empleados que no fueron eliminados.
    const updateEmployee = await EmployeeModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } }, // Buscar empleado activo
      updates, // Campos enviados desde Bruno
      {
        returnDocument: "after", // Devolver documento actualizado
        runValidators: true, // Validar los campos modificados
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

    // Primero damos de baja al empleado, sin borrarlo.
    const deletedEmployee = await EmployeeModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { returnDocument: "after" },
    );

    // Si el empleado no existe o ya fue eliminado, respondemos 404.
    if (!deletedEmployee) {
      return res.status(404).json({
        msg: "Empleado no encontrado",
      });
    }

    // En cascada, damos de baja también su contrato.
    await ContractModel.updateOne( //trabajamos sobre la coleccion de contratos, buscamos por condicion
      {
        employee: id, //busca contrato con el campo employee que coincida con el empleamos que dimos de baja 
        isDeleted: { $ne: true } // solo con contratos activos
      }, 
      { $set: { isDeleted: true } }, // y seteamos el contrato
    );

    // otra forma:
    // const deletedUser2 = await UserModel.deleteOne({ _id: id });

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

//añadir un proyecto a un empleado 
export const addProjectToEmployee = async (req, res) => {
  try {
    // Recibimos los dos IDs desde la URL.
    const { id, projectId } = req.params;

    // Buscamos al empleado siempre que no esté eliminado
    const employee = await EmployeeModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!employee) {
      return res.status(404).json({
        msg: "Empleado no encontrado",
      });
    }

    // Comprobamos que el proyecto exista y esté disponible.
    const project = await ProjectModel.findOne({
      _id: projectId,
      isDeleted: { $ne: true },
    });

    if (!project) {
      return res.status(404).json({
        msg: "Proyecto no encontrado",
      });
    }

    // Revisamos si el empleado ya tiene asignado ese proyecto.
    const alreadyAssigned = employee.projects.some((id) => //some recorre el arreglo y devuelve true cuando encuentra un elemento que cumple una condicion.
      id.equals(project._id), //equals para comparar los object ids
    );

    if (alreadyAssigned) {
      return res.status(409).json({
        msg: "El empleado ya está asignado a este proyecto",
      });
    }

    // Agregamos el ID al arreglo sin borrar los proyectos anteriores.
    const updatedEmployee = await EmployeeModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $addToSet: { projects: project._id } }, // agrega el id al arreglo sin reemplazar los elementos, evita 
      { returnDocument: "after", runValidators: true },
    );

    return res.status(200).json({
      msg: "Proyecto asignado correctamente",
      data: updatedEmployee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};
