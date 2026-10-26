import { model, Schema, Types } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true, // campo obligatorio
    },

    email: {
      type: String,
      required: true, // campo obligatorio
      unique: true, // valor único en la colección
    },

    //1:N, cada empleado guarda el id de su departamento
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true, // campo obligatorio
    },

    //N:M cada empleado puede tner varios id de proyectos
    //tipo arreglo, porque podemos almacenar variois elementos, las llaves indican el modelo a seguir para guardar las referencias
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    // Indica si el empleado fue dado de baja.
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Relación 1:1 inversa: contrato correspondiente al empleado.
employeeSchema.virtual("contract", {
  ref: "Contract",
  localField: "_id",      // Employee._id
  foreignField: "employee", // Contract.employee
  justOne: true,
});

//para permitir que los virtuales se muestren en las respuestas json
employeeSchema.set("toJSON", { virtuals: true });

export const EmployeeModel = model("Employee", employeeSchema);
