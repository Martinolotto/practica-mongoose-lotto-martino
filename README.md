# Práctica de MongoDB y Mongoose

- Alumno: Lotto Martino

#### Modelos definidos

Gestion de proyectos 

```
- Departamento - Department: name, location
- Empleado - Employee: name, email, department, projects[]
- Proyecto - Project: name, status, milestones[]
- Contrato - Contract: employee, type, startDate
```

#### Relaciones

```
- 1:1 -> Employee <-> Contract
- 1:N -> Department -> Employee
- N:M -> Employee <-> Project
- Embebido -> Project.milestones[]
```

#### Justificación de las relaciones

**1:1 - Employee y Contract:** Un empleado puede tener un único contrato vigente, y cada contrato corresponde a un solo empleado. Uso documentos referenciados para mantener los datos del contrato separados de los datos del empleado. La referencia se guarda en `Contract.employee` como un ObjectId único.

 **1:N - Department y Employee:** Un departamento puede tener muchos empleados, pero cada empleado pertenece a un solo departamento. Uso referencias porque cada empleado se guarda de forma independiente y tiene el ID del departamento al que pertenece. La referencia se guarda en `Employee.department` como un ObjectId.

**N:M - Employee y Project:** Un empleado puede participar en varios proyectos, y un mismo proyecto puede tener muchos empleados. Uso referencias porque los proyectos se guardan por separado y pueden tener varios empleados asignados sin duplicar sus datos. Las referencias se guardan en `Employee.projects[]` como un arreglo de ObjectId.

**Embebido - Project.milestones[]:** Un proyecto puede tener varios hitos o etapas que se deben completar. Uso documentos embebidos porque los hitos forman parte de cada proyecto y no necesitamos guardarlos en otra colección. Se almacenan en `Project.milestones[]` como un arreglo de objetos con `name` y `completed`.