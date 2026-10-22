import mongoose from "mongoose";

export const startDB = async () => {
  try {
    //conectar a la bd
    await mongoose.connect("mongodb://127.0.0.1:27017/practica-mongoose-TLP");

    //await mongoose.connection.dropDatabase();

    // Mostrar qué base está utilizando Mongoose.
    console.log("Conectado a MongoDB:", mongoose.connection.name);

  } catch (error) {
    
    console.error("Error de conexion a la bd:", error.message);
    throw error;
  }
};
