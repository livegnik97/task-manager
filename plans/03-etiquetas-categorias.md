# Plan: Etiquetas y categorías

## Objetivo
Añadir un sistema de etiquetas (tags) con colores para clasificar tareas más allá del estado, permitiendo filtrado y agrupación visual por etiqueta.

## Qué implica
- Entidad Tag/Etiqueta con nombre, color (código hexadecimal) y descripción opcional
- Relación muchos a muchos entre Task y Tag (una tarea puede tener varias etiquetas, una etiqueta puede estar en varias tareas)
- Endpoints para crear, listar, editar y borrar etiquetas
- Endpoint para asignar/quitar etiquetas a una tarea
- Filtrado de tareas por etiqueta en el listado

## Qué se va a hacer
1. Crear entidad Tag con campos: id, nombre, color (hex), descripción opcional
2. Crear tabla intermedia task_tag para la relación muchos a muchos
3. DTOs para crear/actualizar etiquetas
4. Endpoints: POST/GET/GET:id/PATCH/DELETE /tags
5. Endpoint POST/DELETE /tasks/:id/tags/:tagId para asignar/quitar etiquetas
6. Parámetro de filtro ?tagId= en GET /tasks para filtrar por etiqueta
7. Mostrar etiquetas en la respuesta de cada tarea

## Requisitos técnicos
- Relación muchos a muchos entre Task y Tag
- Validar que el color sea un código hexadecimal válido
- No permitir etiquetas con nombres duplicados

## Criterios de aceptación
- [ ] Se puede crear una etiqueta con nombre y color
- [ ] Se puede asignar una etiqueta a una tarea existente
- [ ] Se puede quitar una etiqueta de una tarea
- [ ] Al filtrar por etiqueta, solo se muestran las tareas que la tienen
- [ ] Una tarea puede tener múltiples etiquetas

---

**Estado:** Planificado  
**Prioridad:** Media  
**Dependencias:** Modelo Task existente