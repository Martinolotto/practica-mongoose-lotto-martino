import express from "express";
import { startDB } from "./src/config/database.js";
import cors from "cors";
import "dotenv/config";

//routers
import { departmentRouter } from "./src/routes/department.routes.js";
import { projectRouter } from "./src/routes/project.routes.js";
import { employeeRouter } from "./src/routes/employee.routes.js";
import { contractRouter } from "./src/routes/contract.routes.js";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());

// para que entienda el formato json
app.use(express.json());


//ruta de prueba del servidor
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "servidor prendido",
  });
});

//rutas
app.use("/api", departmentRouter);
app.use("/api", projectRouter);
app.use("/api", employeeRouter);
app.use("/api", contractRouter);

const startServer = async () => {
  try {
    await startDB();

    app.listen(PORT, async () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.log("No se pudo inciar el servidor");
  }
};

startServer();
