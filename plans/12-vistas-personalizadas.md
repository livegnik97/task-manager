# Plan: Vistas personalizadas

## Objetivo
Permitir guardar la preferencia de vista de cada usuario (tabla, lista, calendario, kanban) para recordar cómo prefiere visualizar las tareas.

## Qué implica
- Configuración de vista por usuario
- Guardar preferencia de vista (tabla, lista, calendario, kanban)
- Endpoint para actualizar la preferencia de vista del usuario

## Qué se va a hacer
1. Agregar campo viewMode (table, list, calendar, kanban) a la configuración de usuario o tablero
2. Endpoint para actualizar la preferencia de vista (PATCH /users/:id/view-mode o similar)

## Requisitos técnicos
- Campo adicional en configuración de usuario o tablero

## Criterios de aceptación
- [ ] Se puede cambiar la vista a tabla, lista, calendario o kanban
- [ ] La preferencia se guarda y se aplica al recargar

---

**Estado:** Planificado  
**Prioridad:** Baja  
**Dependencias:** Múltiples tableros/proyectos (opcional)