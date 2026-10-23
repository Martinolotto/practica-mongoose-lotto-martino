import { ProjectModel } from "../models/project.model.js";

// Crear proyecto
export const createProject = async (req, res) => {
  try {
    const { name, status, milestones } = req.body;

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
    const projects = await ProjectModel.find();

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
    const project = await ProjectModel.findById(id).populate(
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
    const { name, status, milestones } = req.body;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (status !== undefined) updates.status = status;
    if (milestones !== undefined) updates.milestones = milestones;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        msg: "No se enviaron campos para actualizar",
      });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(id, updates, {
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

    const deletedProject = await ProjectModel.findByIdAndDelete(id);

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
