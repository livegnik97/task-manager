# Plan: Tablero Kanban

## Objetivo
Implementar endpoints para obtener tareas agrupadas por estado y cambiar el estado de una tarea, permitiendo construir una vista tipo Kanban (estilo Trello) en el frontend.

## Qué implica
- Agrupar tareas por estado (Pendiente, En curso, Hecha) en una respuesta de API
- Endpoint para cambiar el estado de una tarea
- Endpoint para actualizar el orden/posición de una tarea dentro de un estado
- Ordenar las tareas dentro de cada estado

## Qué se va a hacer
1. Endpoint GET /tasks/kanban para obtener tareas agrupadas por estado
2. Endpoint PATCH /tasks/:id para cambiar el estado de una tarea
3. Endpoint PATCH /tasks/:id/order para cambiar el orden/posición de una tarea dentro de un estado
4. Vincular con el modelo existente de Task (estado PENDING, IN_PROGRESS, DONE)

## Requisitos técnicos
- Backend ya existe (endpoints PATCH /tasks/:id)
- Agrupar resultados por campo status en consulta SQL
- Campo de orden/posición en la entidad Task (opcional)

## Criterios de aceptación
- [ ] Al cambiar el estado de una tarea a IN_PROGRESS, se actualiza correctamente
- [ ] Al cambiar el estado de una tarea a DONE, se actualiza correctamente
- [ ] El orden de las tareas se mantiene al consultar por estado
- [ ] Las tareas se devuelven agrupadas por estado en la respuesta de la API

---

**Estado:** Planificado  
**Prioridad:** Alta  
**Dependencias:** Modelo Task existente