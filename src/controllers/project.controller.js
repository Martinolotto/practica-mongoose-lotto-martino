import { ProjectModel } from "../models/project.model.js";

// Crear proyecto
export const createProject = async (req, res) => {
  try {
    const { name, status, milestones } = matchedData(req, {
      locations: ["body"],
    });

    const newProject = await ProjectModel.create({
      name,
      status,
      milestones,
    });

    return res.status(201).json({
      msg: "Proyecto creado correctamente",
      data: newProject,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// Obtener todos los proyectos
export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({
      isDeleted: { $ne: true } //comprobamos que no muestre documentos que esten borrados
      //$ne = distinto de
    });

    return res.status(200).json({
      msg: "Lista de proyectos",
      data: projects,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// Obtener proyecto por ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Relación N:M inversa: empleados asignados al proyecto.
    //finOne busca un documento que cumpla las condicones que indicamos
    const project = await ProjectModel.findOne({
      _id: id, //comparamos el id solicitado y
      isDeleted: { $ne:true } // que no este eliminado
    }).populate(
      "employees",
      "name projects",
    );

    if (!project) {
      return res.status(404).json({
        msg: "Proyecto no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Proyecto encontrado",
      data: project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// Actualizar proyecto
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, milestones } = matchedData(req, {
      locations: ["body"],
    });

    const updates = {};

    //solo agregamos los campos que se enviaron.
    if (name !== undefined) updates.name = name;
    if (status !== undefined) updates.status = status;
    if (milestones !== undefined) updates.milestones = milestones;

    //comprobamos que no venga vacio
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        msg: "No se enviaron campos para actualizar",
      });
    }
    //no permiti modificaciones sobre un proyecto que ya eliminamos logicamente 
    const updatedProject = await ProjectModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } }, //lo que queremos encontrar
    updates, //los datos que se van a modificar
    {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedProject) {
      return res.status(404).json({
        msg: "Proyecto no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Proyecto actualizado correctamente",
      data: updatedProject,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// Eliminar proyecto
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await ProjectModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } }, //buscamos por id, solo si no esta eliminado
      { $set: { isDeleted: true } }, //cambiamos con set, el isdelete a true si no lo estaba 
      { returnDocument: "after" } //pedimos el documento despues de modificarlo
    );

    if (!deletedProject) {
      return res.status(404).json({
        msg: "Proyecto no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Proyecto eliminado correctamente",
      data: deletedProject,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};
