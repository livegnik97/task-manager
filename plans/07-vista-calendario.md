# Plan: Vista de calendario

## Objetivo
Implementar endpoints para obtener tareas filtradas por rango de fechas (fecha límite), permitiendo construir una vista de calendario en el frontend.

## Qué implica
- Consultar tareas según su fecha límite (dueDate) dentro de un rango de fechas
- Filtrar tareas por mes o semana específica
- Devolver tareas con su fecha límite para renderizado en calendario

## Qué se va a hacer
1. Endpoint GET /tasks/calendar?month=YYYY-MM para obtener tareas de un mes específico
2. Endpoint GET /tasks/calendar?week=YYYY-WW para obtener tareas de una semana específica
3. Filtrar tareas que tengan dueDate dentro del rango solicitado
4. Formato de respuesta optimizado para calendario (id, título, fecha límite, color según prioridad/estado)

## Requisitos técnicos
- Consultas SQL con filtrado por rango de fechas (dueDate)
- Formato de respuesta optimizado para calendario

## Criterios de aceptación
- [ ] Se pueden ver las tareas de un mes específico
- [ ] Se pueden ver las tareas de una semana específica
- [ ] Las tareas se filtran por su fecha límite (dueDate)

---

**Estado:** Planificado  
**Prioridad:** Media  
**Dependencias:** Campo dueDate en Task