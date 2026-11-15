# Plan: Historial de cambios (auditoría)

## Objetivo
Registrar quién modificó qué y cuándo en cada tarea, similar al historial de versiones de Notion.

## Qué implica
- Entidad AuditLog con: id, taskId, userId (quien hizo el cambio), campo modificado, valor anterior, valor nuevo, fecha de cambio
- Registrar automáticamente cambios en título, descripción, estado, responsable, fecha límite
- Endpoint para ver el historial de cambios de una tarea específica
- Mostrar el historial en el detalle de la tarea

## Qué se va a hacer
1. Crear entidad AuditLog con campos: id, taskId, userId, campo, valorAnterior, valorNuevo, fechaCambio
2. Interceptar cambios en el servicio de tareas para registrar auditoría automáticamente
3. Endpoint GET /tasks/:id/audit-log para ver historial de una tarea
4. Mostrar historial ordenado por fecha (más reciente primero)

## Requisitos técnicos
- Nueva entidad AuditLog con relación a Task
- Interceptores o lógica en el servicio para capturar cambios antes de guardarlos
- Almacenar valores anteriores y nuevos como JSON o texto

## Criterios de aceptación
- [ ] Al cambiar el estado de una tarea, se registra en el historial
- [ ] Al cambiar el responsable, se registra en el historial
- [ ] Se puede ver el historial de cambios de una tarea
- [ ] El historial muestra quién, cuándo, qué cambió y de qué a qué

---

**Estado:** Planificado  
**Prioridad:** Alta  
**Dependencias:** Modelo Task existente