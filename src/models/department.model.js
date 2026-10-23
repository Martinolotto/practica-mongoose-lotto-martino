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

export const DepartmentModel = model("Department", departmentSchema);
