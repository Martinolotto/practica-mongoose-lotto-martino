import { ContractModel } from "../models/contract.model.js";

// Crear contrato
export const createContract = async (req, res) => {
  try {
    const { employee, type, startDate } = req.body;

    const newContract = await ContractModel.create({
      employee,
      type,
      startDate,
    });

    return res.status(201).json({
      msg: "Contrato creado correctamente",
      data: newContract,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// Obtener todos los contratos
export const getAllContracts = async (req, res) => {
  try {
    const contracts = await ContractModel.find();

    return res.status(200).json({
      msg: "Lista de contratos",
      data: contracts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// Obtener contrato por ID
export const getContractById = async (req, res) => {
  try {
    const { id } = req.params;

    // Referencia directa al empleado del contrato.
    const contract = await ContractModel.findById(id).populate(
      "employee",
      "name email",
    );

    if (!contract) {
      return res.status(404).json({
        msg: "Contrato no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Contrato encontrado",
      data: contract,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// Actualizar contrato
export const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee, type, startDate } = req.body;

    const updates = {};

    if (employee !== undefined) updates.employee = employee;
    if (type !== undefined) updates.type = type;
    if (startDate !== undefined) updates.startDate = startDate;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        msg: "No se enviaron campos para actualizar",
      });
    }

    const updatedContract = await ContractModel.findByIdAndUpdate
      (
        id,
        updates,
      {
      returnDocument: "after",
      runValidators: true,
      });

    if (!updatedContract) {
      return res.status(404).json({
        msg: "Contrato no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Contrato actualizado correctamente",
      data: updatedContract,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// Eliminar contrato
export const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContract = await ContractModel.findByIdAndDelete(id);

    if (!deletedContract) {
      return res.status(404).json({
        msg: "Contrato no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Contrato eliminado correctamente",
      data: deletedContract,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};
