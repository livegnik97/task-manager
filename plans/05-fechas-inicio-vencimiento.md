# Plan: Fechas de inicio y vencimiento

## Objetivo
Añadir un campo de "fecha de inicio" junto a la fecha límite existente (`dueDate`), permitiendo ver la duración estimada y actual de cada tarea.

## Qué implica
- Agregar campo `startDate` a la entidad Task
- Mantener el campo `dueDate` existente como fecha límite
- Validar que la fecha de inicio no sea posterior a la fecha límite
- Mostrar duración calculada (días entre startDate y dueDate) en la respuesta de la tarea

## Qué se va a hacer
1. Agregar campo `startDate` (DateTime, nullable) a la entidad Task
2. Actualizar DTO CreateTaskDto y UpdateTaskDto para incluir startDate opcional
3. Validar que startDate no sea posterior a dueDate si ambos están presentes
4. Calcular y mostrar `durationDays` en TaskModel (diferencia en días entre startDate y dueDate)
5. Actualizar migración de base de datos para agregar columna startDate

## Requisitos técnicos
- Nueva columna startDate en tabla tasks
- Validación de lógica de fechas (startDate <= dueDate)
- Campo calculado durationDays en el modelo de respuesta (no se persiste en BD)

## Criterios de aceptación
- [ ] Se puede crear una tarea con fecha de inicio y fecha límite
- [ ] No se permite crear una tarea con fecha de inicio posterior a la fecha límite
- [ ] La respuesta incluye la duración calculada en días
- [ ] Si no hay fecha de inicio, durationDays es null o 0

---

**Estado:** Planificado  
**Prioridad:** Media  
**Dependencias:** Modelo Task existente