import { model, Schema, Types } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    //referencia, task no  puede existir sin un author
    //documento referenciado: se guarda unicamente el identificador de otro documento.
    author: {
      type: Types.ObjectId, //guarda el id del usaurio
      required: true,
      ref: "User",
      //unique: true, una forma de hacer 1:1
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TaskModel = model("Task", taskSchema);
