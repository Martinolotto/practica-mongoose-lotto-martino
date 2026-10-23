import { model, Schema } from "mongoose";

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
// Relación 1:N inversa: consultar empleados de un departamento.
departmentSchema.virtual("employees", {
  ref: "Employee",
  localField: "_id",        // Department._id
  foreignField: "department", // Employee.department
  justOne: false,
});

departmentSchema.set("toJSON", { virtuals: true });

export const DepartmentModel = model("Department", departmentSchema);
