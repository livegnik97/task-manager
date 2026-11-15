# Plan: Múltiples tableros / Proyectos

## Objetivo
Permitir crear múltiples tableros o proyectos independientes, cada uno con su propio conjunto de tareas y responsables, similar a los "workspaces" de Notion o tableros de Trello.

## Qué implica
- Entidad Board/Proyecto con nombre, descripción y color
- Cada tarea pertenece a un tablero/proyecto específico
- Listar tableros, ver tareas de un tablero específico
- Crear, editar y borrar tableros (si no tienen tareas asociadas)

## Qué se va a hacer
1. Crear entidad Board/Project con campos: id, nombre, descripción, color, fecha de creación
2. Agregar campo project_id o board_id a la entidad Task como clave foránea
3. Endpoints CRUD para tableros: POST, GET, GET:id, PATCH, DELETE /projects
4. Endpoint GET /projects/:id/tasks para listar tareas de un tablero
5. Modificar endpoint POST /tasks para aceptar project_id
6. Modificar endpoint GET /tasks para filtrar por project_id opcional

## Requisitos técnicos
- Nueva entidad Project/Board con relación uno a muchos hacia Task
- Migración de base de datos para agregar project_id a tasks
- Validar que no se pueda borrar un tablero que tenga tareas asociadas

## Criterios de aceptación
- [ ] Se puede crear un tablero con nombre y descripción
- [ ] Se puede crear una tarea asignándola a un tablero específico
- [ ] Al listar tareas de un tablero, solo se muestran las de ese tablero
- [ ] No se puede borrar un tablero que tenga tareas asociadas

---

**Estado:** Planificado  
**Prioridad:** Alta  
**Dependencias:** Modelo Task existente