import { model, Schema } from "mongoose";

const roleSchema = new Schema(
  {
    rolename: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//relacion virtual para buscar en el modelo users cuando se consulte sin agregarlo a la coleccion
roleSchema.virtual("users", {
  //crea una propiedad virtual
  //busca en users todos los documentos cuyo role coincida con el id del user
  ref: "User", //tabla referencia
  localField: "_id", // se toma el id del rol y
  foreignField: "roles", //se compara con el campo role de user
  justOne: false, // porque se esperan varios usuarios un arreglo
});

//para permitir que los virtuales se muestren en las respuestas json
roleSchema.set("toJSON", { virtuals: true });

export const RoleModel = model("Role", roleSchema);
