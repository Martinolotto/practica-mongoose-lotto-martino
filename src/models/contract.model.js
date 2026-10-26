import { model, Schema } from "mongoose";

const contractSchema = new Schema(
  {
    // 1:1: cada contrato referencia a un empleado.
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },

    type: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

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

export const ContractModel = model("Contract", contractSchema);
