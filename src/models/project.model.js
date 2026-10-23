import { model, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["planning", "in_progress", "finished"],
      default: "planning",
      required: true,
    },

    // Documentos embebidos: objetivos propios del proyecto.
    milestones: [
      {
        name: {
          type: String,
          required: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
// Relación N:M inversa: empleados asignados a un proyecto.
projectSchema.virtual("employees", {
  ref: "Employee",
  localField: "_id",       // Project._id
  foreignField: "projects", // Employee.projects[]
  justOne: false,
});

projectSchema.set("toJSON", { virtuals: true });

export const ProjectModel = model("Project", projectSchema);
