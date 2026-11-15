# Plan: Comentarios en tareas

## Objetivo
Añadir un hilo de comentarios por tarea, permitiendo discusión colaborativa y seguimiento de cambios, similar a los comentarios en Notion o Trello.

## Qué implica
- Entidad Comment con texto, autor, fecha de creación y relación con la tarea
- Endpoints para crear, listar, editar y borrar comentarios de una tarea específica
- Mostrar comentarios asociados al ver el detalle de una tarea

## Qué se va a hacer
1. Crear entidad Comment con campos: id, contenido, autor (nombre o user_id), fecha de creación, task_id
2. Relación muchos a uno entre Comment y Task (muchos comentarios por tarea)
3. Endpoints:
   - POST /tasks/:id/comments - crear comentario en una tarea
   - GET /tasks/:id/comments - listar comentarios de una tarea
   - PATCH /comments/:id - editar un comentario
   - DELETE /comments/:id - borrar un comentario
4. Incluir comentarios al obtener el detalle de una tarea (GET /tasks/:id)
5. Validar que el autor no esté vacío y el contenido tenga longitud mínima

## Requisitos técnicos
- Nueva entidad Comment con relación ManyToOne a Task
- Validación de longitud mínima en el contenido (mínimo 1 carácter)
- Ordenar comentarios por fecha de creación (más reciente primero o último primero)

## Criterios de aceptación
- [ ] Se puede agregar un comentario a una tarea existente
- [ ] Se pueden listar todos los comentarios de una tarea
- [ ] Se puede editar el contenido de un comentario propio
- [ ] Se puede borrar un comentario
- [ ] Al ver el detalle de una tarea, se muestran sus comentarios asociados

---

**Estado:** Planificado  
**Prioridad:** Alta  
**Dependencias:** Modelo Task existente