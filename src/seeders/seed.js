import "dotenv/config";
import mongoose from "mongoose";

import { startDB } from "../config/database.js";
import { DepartmentModel } from "../models/department.model.js";
import { ProjectModel } from "../models/project.model.js";
import { EmployeeModel } from "../models/employee.model.js";
import { ContractModel } from "../models/contract.model.js";

// Busca un registro existente o lo crea si todavía no existe.
const getOrCreate = async (Model, filter, data) => {
  return await Model.findOneAndUpdate(
    filter,
    { $setOnInsert: data },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );
};

const seed = async () => {
  try {
    // 1. Conectamos a la misma base que usa nuestra API.
    await startDB();

    if (mongoose.connection.name !== "practica-mongoose-TLP") {
      throw new Error("Base de datos incorrecta. Se canceló el seeder.");
    }

    // 2. DEPARTAMENTOS
    const desarrollo = await getOrCreate(
      DepartmentModel,
      { name: "Desarrollo" },
      {
        name: "Desarrollo",
        location: "Formosa",
      },
    );

    const recursosHumanos = await getOrCreate(
      DepartmentModel,
      { name: "Recursos Humanos" },
      {
        name: "Recursos Humanos",
        location: "Formosa",
      },
    );

    const administracion = await getOrCreate(
      DepartmentModel,
      { name: "Administración" },
      {
        name: "Administración",
        location: "Formosa",
      },
    );

    // 3. PROYECTOS
    const asistencia = await getOrCreate(
      ProjectModel,
      { name: "Sistema de Asistencia" },
      {
        name: "Sistema de Asistencia",
        status: "in_progress",
        milestones: [
          { name: "Definir requerimientos", completed: true },
          { name: "Desarrollar backend", completed: false },
        ],
      },
    );

    const portal = await getOrCreate(
      ProjectModel,
      { name: "Portal Interno" },
      {
        name: "Portal Interno",
        status: "planning",
        milestones: [
          { name: "Planificación", completed: true },
          { name: "Diseño de interfaz", completed: false },
        ],
      },
    );

    const documentos = await getOrCreate(
      ProjectModel,
      { name: "Gestor Documental" },
      {
        name: "Gestor Documental",
        status: "finished",
        milestones: [
          { name: "Desarrollo", completed: true },
          { name: "Pruebas", completed: true },
        ],
      },
    );

    // 4. EMPLEADOS
    // Guardamos los ObjectId reales de departamentos y proyectos.
    const ana = await getOrCreate(
      EmployeeModel,
      { email: "ana.seed@example.com" },
      {
        name: "Ana Pérez",
        email: "ana.seed@example.com",
        department: desarrollo._id,
        projects: [asistencia._id, portal._id],
      },
    );

    const bruno = await getOrCreate(
      EmployeeModel,
      { email: "bruno.seed@example.com" },
      {
        name: "Bruno Gómez",
        email: "bruno.seed@example.com",
        department: desarrollo._id,
        projects: [asistencia._id],
      },
    );

    const carla = await getOrCreate(
      EmployeeModel,
      { email: "carla.seed@example.com" },
      {
        name: "Carla López",
        email: "carla.seed@example.com",
        department: recursosHumanos._id,
        projects: [portal._id],
      },
    );

    const diego = await getOrCreate(
      EmployeeModel,
      { email: "diego.seed@example.com" },
      {
        name: "Diego Ramírez",
        email: "diego.seed@example.com",
        department: administracion._id,
        projects: [documentos._id],
      },
    );

    // 5. CONTRATOS
    // Cada contrato guarda el ObjectId de un único empleado.
    const contratoAna = await getOrCreate(
      ContractModel,
      { employee: ana._id },
      {
        employee: ana._id,
        type: "Permanente",
        startDate: new Date("2026-03-01"),
      },
    );

    const contratoBruno = await getOrCreate(
      ContractModel,
      { employee: bruno._id },
      {
        employee: bruno._id,
        type: "Temporal",
        startDate: new Date("2026-05-15"),
      },
    );

    const contratoCarla = await getOrCreate(
      ContractModel,
      { employee: carla._id },
      {
        employee: carla._id,
        type: "Permanente",
        startDate: new Date("2026-02-10"),
      },
    );

    // Diego queda sin contrato para probar ese caso.

    // 6. Mostramos los identificadores para usarlos en Bruno.
    console.log("\nSEED COMPLETADO\n");

    const records = [
      ["Department - Desarrollo", desarrollo],
      ["Department - Recursos Humanos", recursosHumanos],
      ["Department - Administración", administracion],
      ["Project - Sistema de Asistencia", asistencia],
      ["Project - Portal Interno", portal],
      ["Project - Gestor Documental", documentos],
      ["Employee - Ana", ana],
      ["Employee - Bruno", bruno],
      ["Employee - Carla", carla],
      ["Employee - Diego", diego],
      ["Contract - Ana", contratoAna],
      ["Contract - Bruno", contratoBruno],
      ["Contract - Carla", contratoCarla],
    ];

    records.forEach(([label, document]) => {
      console.log(`${label}: ${document._id}`);
    });
  } catch (error) {
    console.error("Error al ejecutar el seeder:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

await seed();
