# Plan: Prioridades

## Objetivo
Implementar un sistema de prioridad (Baja, Media, Alta, Crítica) con indicador visual para ordenar las tareas por urgencia.

## Qué implica
- Agregar campo `priority` a la entidad Task con valores: LOW, MEDIUM, HIGH, CRITICAL
- Permitir ordenar las tareas por prioridad en el listado
- Filtrar tareas por prioridad

## Qué se va a hacer
1. Agregar campo `priority` (enum: LOW, MEDIUM, HIGH, CRITICAL) a la entidad Task
2. Actualizar DTOs CreateTaskDto y UpdateTaskDto para incluir prioridad
3. Añadir parámetro de filtro `?priority=` en GET /tasks
4. Añadir parámetro de ordenamiento `?orderBy=priority&orderDirection=DESC` en GET /tasks
5. Incluir el campo de prioridad en la respuesta de cada tarea

## Requisitos técnicos
- Nuevo campo enum en la entidad Task
- Validar que el valor de prioridad sea uno de los permitidos
- Ordenamiento por prioridad en consultas SQL

## Criterios de aceptación
- [ ] Se puede crear una tarea con prioridad asignada
- [ ] Se puede filtrar tareas por prioridad (?priority=HIGH)
- [ ] Se puede ordenar tareas por prioridad (?orderBy=priority&orderDirection=DESC)
- [ ] La respuesta incluye el campo de prioridad en cada tarea

---

**Estado:** Planificado  
**Prioridad:** Media  
**Dependencias:** Modelo Task existente