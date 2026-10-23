import { UserModel } from "../models/user.model.js";
import { TaskModel } from "../models/task.model.js";

//crear user
export const createUser = async (req, res) => {
  try {
    //desestructuracion del body
    const { username, password, email, addresses, roles } = req.body;

    const newUser = await UserModel.create({
      username,
      email,
      password,
      addresses,
      roles,
    });

    return res.status(201).json({
      msg: "Usuario creado correctamente",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//obtener todos
export const getAllUsers = async (req, res) => {
  try {
    //busca en el modelo
    const users = await UserModel.find().select("-password");

    return res.status(200).json({
      msg: "Lista de usuarios",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//obtener user por id
export const getUserById = async (req, res) => {
  try {
    //id desde el param
    const { id } = req.params;

    // const users = await UserModel.findById(id);

    //mostrar tareas desde user

    // metodo1 buscar todas las tareas cuyo author sea ese user
    // const tasks = await TaskModel.find({ author: id });

    //metodo2, virtual populate, con cambios en el modelo
    //recorrido inverso al populate, sin referenciar directamente en el modelo a las tareas.
    //consultar las tareas desde user
    const user = await UserModel.findById(id)
      .select("-password") //excluye la contraseña
      .populate("tasks", "title") //usa la relacion virtual
      .populate("roles", "rolename");

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Usuario encontrado",
      data: {
        user, //cuando repondemos con json, el toJSON: { virtuals: true del modelo permite incluir esta propiedad
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//actualizar user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const updateUser = await UserModel.findByIdAndUpdate(
      //busca coincidencia y actualiza solo el username
      id,
      { username },
      //para que muestre todos los datos despues de actualizar
      //after mostramos lo ultimo que se actualizo, before muestra antes de actualizarse
      { returnDocument: "after" },
    );

    //otra forma: //entender este metodo
    //  const updatedUser2 = await UserModel.updateOne({ _id: id }, { username });

    if (!updateUser) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Usuario actualizado correctamente",
      data: updateUser, //por que data?: facilita consumir desde el front
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

//borrar user
export const deleteUser = async (req, res) => {
  try {
    //Obtener el id desde params
    const { id } = req.params;

    // Buscar y eliminar el documento por id
    const deletedUser = await UserModel.findByIdAndDelete(id);

    // otra forma:
    // const deletedUser2 = await UserModel.deleteOne({ _id: id });

    if (!deletedUser) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Usuario eliminado correctamente",
      data: deletedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

// - traer desde user las tareas,
// - como poder validar un arreglo desde user.model para que el arreglo se detecte cuando es vacio y no se envie igual a la base de datos,
// - como traer los datos referenciados desde la otra colleccion que no tiene referencia,
// - traer los users desde role,  hay que hacer una configuracion, averiguar,
// - como traigo todas las tareas cuando listo todos los usuarios,

// hay un problema, porque yo los roles ya los agrego directamente cunado creo un usuario, peor ahora cuando quiero agregar mas roles a un usuario que tengo que hacer
