import { Router } from "express";

import {

} from "../controllers/employee.controller.js";

export const userRouter = Router();

userRouter.post("/users", createUser);

userRouter.get("/users", getAllUsers);

userRouter.get("/users/:id", getUserById);

userRouter.put("/users/:id", updateUser);

userRouter.delete("/users/:id", deleteUser);
