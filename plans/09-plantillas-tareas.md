# Plan: Plantillas de tareas

## Objetivo
Permitir crear plantillas reutilizables para tareas, acelerando la creación de tareas repetitivas con campos predefinidos.

## Qué implica
- Entidad TaskTemplate con título, descripción, estado por defecto, prioridad, responsable predeterminado, fecha límite relativa
- Endpoint para crear plantillas, listarlas, obtener una, editarla y borrarla
- Endpoint para crear una tarea a partir de una plantilla (pre-rellena los campos)

## Qué se va a hacer
1. Crear entidad TaskTemplate con campos: id, nombre, descripción, estado por defecto, prioridad, responsable predeterminado (opcional), días para vencimiento (opcional)
2. Endpoints CRUD para plantillas: POST/GET/GET:id/PATCH/DELETE /task-templates
3. Endpoint POST /task-templates/:id/create-task para crear una tarea basada en una plantilla
4. Al crear desde plantilla, pre-rellenar los campos y calcular dueDate basado en días para vencimiento si está definido

## Requisitos técnicos
- Nueva entidad TaskTemplate
- Relación opcional con Assignee para responsable predeterminado
- Validar que los días para vencimiento sean positivos

## Criterios de aceptación
- [ ] Se puede crear una plantilla de tarea
- [ ] Se puede listar todas las plantillas
- [ ] Se puede crear una tarea a partir de una plantilla (campos pre-rellenados)
- [ ] Si la plantilla tiene días para vencimiento, se calcula la fecha límite automáticamente

---

**Estado:** Planificado  
**Prioridad:** Media  
**Dependencias:** Modelo Task y Assignee existentes