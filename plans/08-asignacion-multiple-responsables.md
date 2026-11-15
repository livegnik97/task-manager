# Plan: Asignación múltiple de responsables

## Objetivo
Permitir que una tarea tenga varios responsables, no solo uno, permitiendo trabajo colaborativo en una misma tarea.

## Qué implica
- Cambiar el campo `assignee` (un responsable) por una relación muchos a muchos con responsables
- Una tarea puede tener múltiples responsables
- Un responsable puede tener múltiples tareas asignadas
- Mostrar todos los responsables en la respuesta de la tarea

## Qué se va a hacer
1. Eliminar el campo `assigneeId` de la entidad Task
2. Crear tabla intermedia task_assignee para la relación muchos a muchos
3. Actualizar DTOs para aceptar arreglo de IDs de responsables (`assigneeIds: string[]`)
4. Actualizar TaskModel para devolver arreglo de responsables (`assignees: AssigneeModel[]`)
5. Endpoint para agregar/quitar responsables de una tarea
6. Actualizar lógica de filtrado por responsable (buscar tareas donde el responsable esté en la lista)

## Requisitos técnicos
- Relación muchos a muchos entre Task y Assignee
- Tabla intermedia task_assignee
- Actualizar lógica de consultas para filtrar por responsable en tabla intermedia

## Criterios de aceptación
- [ ] Se puede crear una tarea con múltiples responsables
- [ ] Se puede agregar un responsable a una tarea existente
- [ ] Se puede quitar un responsable de una tarea
- [ ] Al ver una tarea, se muestran todos sus responsables
- [ ] Al filtrar por responsable, se muestran todas las tareas donde ese responsable esté asignado

---

**Estado:** Planificado  
**Prioridad:** Alta  
**Dependencias:** Modelo Task y Assignee existentes