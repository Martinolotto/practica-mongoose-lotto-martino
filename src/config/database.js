import mongoose from "mongoose";

export const startDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mongoose");

    //await mongoose.connection.dropDatabase();

    console.log("conectado a la base de datos correctamente");
  } catch (error) {
    console.log("no se pudo conectar a la base de datos");
  }
};
