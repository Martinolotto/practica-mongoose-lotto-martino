# Practica de MongoDB y Mongoose

- Alumno: Lotto Martino

#### Modelos definidos:

```
- User
- Profile
- Task
- Role
```

#### Relaciones:

```
- 1:1 -> User <-> Profile
- 1:N -> User -> Task
- N:M -> User <-> Role
- Embebidos User.addresses
```

#### Justificación de las relaciones

- **User.addresses (Embebido):** Las direcciones se almacenan dentro del usuario porque pertenecen directamente a él y normalmente se consultan junto con sus datos.

- **User - Profile (1:1):** Se utiliza una referencia para separar la información personal de los datos de acceso. Cada usuario puede tener un único perfil.

- **User - Task (1:N):** Cada tarea referencia a su autor mediante un ObjectId. Esto permite gestionar las tareas independientemente y consultar todas las tareas de un usuario.

- **User - Role (N:M):** Los usuarios pueden tener varios roles y cada rol puede pertenecer a múltiples usuarios. Se utilizan referencias para reutilizar los roles sin duplicar sus datos.
