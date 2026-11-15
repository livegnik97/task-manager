# Plan: Búsqueda global

## Objetivo
Implementar búsqueda全文 en título, descripción, comentarios y etiquetas para encontrar tareas rápidamente.

## Qué implica
- Endpoint de búsqueda global que busque en título y descripción de tareas
- Opcionalmente buscar en comentarios y etiquetas asociadas
- Devolver resultados ordenados por relevancia
- Paginar resultados de búsqueda

## Qué se va a hacer
1. Endpoint GET /search?q=texto para buscar tareas
2. Búsqueda por título y descripción usando ILIKE o full-text search de PostgreSQL
3. Opcional: buscar también en comentarios asociados a tareas
4. Opcional: filtrar por etiquetas en la búsqueda
5. Devolver resultados paginados con metadatos de paginación

## Requisitos técnicos
- Consulta SQL con ILIKE o to_tsquery para búsqueda full-text
- Join con tabla de comentarios si se busca en comentarios
- Join con tabla de etiquetas si se filtra por etiqueta

## Criterios de aceptación
- [ ] Se puede buscar tareas por título
- [ ] Se puede buscar tareas por descripción
- [ ] Los resultados están paginados
- [ ] Los resultados están ordenados por relevancia (coincidencias en título primero que en descripción)

---

**Estado:** Planificado  
**Prioridad:** Media  
**Dependencias:** Modelo Task y Comentario (si existe)