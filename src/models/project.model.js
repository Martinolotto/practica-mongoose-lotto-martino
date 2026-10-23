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

    // Documentos embebidos: hitos propios del proyecto.
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

export const ProjectModel = model("Project", projectSchema);
