import { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true, // campo obligatorio
      unique: true, // valor único en la colección
    },
    email: {
      type: String,
      required: true, // campo obligatorio
      unique: true, // valor único en la colección
    },
    password: {
      type: String,
      required: true, // campo obligatorio
    },
    //documento embebido: la informacion vive dentro del mismo documeto, las direcciones etan directaente dentro de user, no se necesita populate para acceder
    addresses: [
      // un arreglo de tipos
      {
        _id: false,
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
      },
    ],
    //documento referenciado
    roles: [
      //un arreglo de un solo valor
      {
        type: Types.ObjectId,
        ref: "Role",
        required: true,
      },
    ],
  },
  {
    versionKey: false,
  },
);

//relacion virtual para buscar en el modelo task cuando se consulte sin agregarlo a la coleccion
userSchema.virtual("tasks", {
  //crea una propiedad virtual
  //busca en task todos los documentos cuyo author coincida con el id del user
  ref: "Task", //tabla referencia
  localField: "_id", // se toma el id del usuario y
  foreignField: "author", //se compara con el campo author de task
  justOne: false, // porque se esperan varias tareas un arreglo
});

//acceder a perfil desde user
userSchema.virtual("profile", {
    ref: "Profile",
    localField: "_id",
    foreignField: "user",
    justOne: true
});

//para permitir que los virtuales se muestren en las respuestas json
userSchema.set("toJSON", { virtuals: true });

export const UserModel = model("User", userSchema);
