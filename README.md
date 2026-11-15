# Task Manager API — Backend Demo (NestJS + TypeORM + PostgreSQL)

API REST para gestionar tareas desarrollada como prueba técnica para posición de Backend Node. Cumple los 6 requisitos del enunciado: CRUD, filtros + paginación, validación y códigos HTTP, base de datos con migraciones, al menos 3 tests (se incluyen 29), y README completo.

---

## 🚀 Cómo ejecutarlo

### Requisitos
- Node.js (v20+)
- pnpm (recomendado) o npm
- PostgreSQL local (puerto 5433) — **solo si usas `USE_DB=true`**

### Pasos

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd task-manager

# 2. Instalar dependencias
pnpm install

# 3. Variables de entorno
cp .env.example .env
# Editar .env según tu entorno:
#   USE_DB=false  → modo local sin base de datos (Map en memoria, ideal para pruebas)
#   USE_DB=true   → modo PostgreSQL (requiere BD en localhost:5433)

# 4. Si usas USE_DB=true, crear la base de datos y aplicar migraciones:
#   - Crear la DB: createdb -h localhost -p 5433 -U root task_manager_db
#   - Ejecutar migraciones: pnpm run migration:run

# 5. Iniciar la aplicación
pnpm run start:dev
```

### Iniciar con variable de entorno directa (sin editar .env)

También puedes pasar la variable directamente al comando:

```bash
# Modo local (sin PostgreSQL)
USE_DB=false pnpm run start:dev

# Modo PostgreSQL
USE_DB=true pnpm run start:dev
```

La API quedará disponible en: `http://localhost:3000`

### Modo local sin base de datos (recomendado para pruebas)

Por defecto `USE_DB=false`, así que no necesitas instalar PostgreSQL ni Docker. Las tareas y responsables se guardan en un `Map` en memoria mientras el backend se ejecuta.

---

## 📋 Endpoints

Todas las rutas están bajo el prefijo `/api`.

### Tareas (`/api/tasks`)

| Método | Ruta | Descripción | Éxito |
|--------|------|-------------|-------|
| `POST` | `/api/tasks` | Crear tarea | `201 Created` |
| `GET` | `/api/tasks` | Listar con filtros + paginación | `200 OK` |
| `GET` | `/api/tasks/:id` | Ver una tarea | `200 OK` / `404` |
| `PATCH` | `/api/tasks/:id` | Editar tarea (parcial) | `200 OK` / `404` |
| `DELETE` | `/api/tasks/:id` | Borrar tarea | `204 No Content` / `404` |

### Responsables (`/api/assignees`)

| Método | Ruta | Descripción | Éxito |
|--------|------|-------------|-------|
| `POST` | `/api/assignees` | Crear responsable | `201 Created` |
| `GET` | `/api/assignees` | Listar con búsqueda + paginación | `200 OK` |
| `GET` | `/api/assignees/:id` | Ver un responsable | `200 OK` / `404` |
| `PATCH` | `/api/assignees/:id` | Editar responsable (parcial) | `200 OK` / `404` |
| `DELETE` | `/api/assignees/:id` | Borrar responsable | `204 No Content` / `404` |

### Query params (`GET /api/tasks`)
- `status` → filtro por estado (`PENDING`, `IN_PROGRESS`, `DONE`)
- `assignee` → filtro por responsable
- `page` → número de página (default `1`)
- `limit` → items por página (default `10`, máximo `100`)

### Query params (`GET /api/assignees`)
- `search` → buscar por nombre o email
- `page` → número de página (default `1`)
- `limit` → items por página (default `10`, máximo `100`)

Respuesta paginada:
```json
{
  "data": [ { "id": "...", "title": "...", "status": "PENDING", ... } ],
  "page": 1,
  "totalPages": 3,
  "limit": 10,
  "total": 25
}
```

---

## 📖 Documentación Swagger

- **Swagger UI (con buscador):** `http://localhost:3000/api/docs`
  - Viene colapsado por defecto (`docExpansion: none`)
  - Incluye buscador (`filter: true`) en la parte superior derecha
  - Botón "JSON" inyectado en la barra superior para descargar el OpenAPI
- **JSON de OpenAPI:** `http://localhost:3000/api/docs/json`
  - Descargable, compatible con Postman/Insomnia
- **Redirección:** `GET /api` redirige automáticamente a `/api/docs`

---

## 🧪 Tests

Se incluyen **29 tests** (Jest + Supertest) cubriendo:

**Tasks (11 tests):**
- Crear tarea → `201`
- Ver tarea inexistente → `404`
- Editar tarea → `200`
- Borrar tarea → `204`
- Validación (sin título, estado inválido) → `400`
- Listado vacío con paginación → `200`
- Filtros por `status` + `assignee` + paginación → página correcta

**Assignees (6 tests):**
- Crear responsable → `201`
- Ver responsable inexistente → `404`
- Editar responsable → `200`
- Borrar responsable → `204`
- Validación (sin nombre) → `400`
- Listado vacío con paginación → `200`

**Integración con AppModule (5 tests):**
- CRUD completo usando el módulo principal
- Filtros + paginación con metadatos
- Búsqueda de responsables

Ejecutar tests:
```bash
pnpm test        # unitarios
pnpm test:e2e    # integración (Jest + Supertest)
```

---

## 🧠 Decisiones tomadas

| Decisión | Justificación |
|----------|---------------|
| **NestJS** | Estándar para Backend Node, muy estructurado, fácil de leer en una entrevista. |
| **TypeORM** | ORM maduro con soporte para TypeScript, migraciones y sincronización automática. |
| **PostgreSQL** | Permitido por el enunciado ("PostgreSQL o SQLite"). Credenciales de la base local del proyecto de referencia (localhost:5433, root/postgres, DB task_manager_db). |
| **Entity ≠ Model** | `task.entity.ts` = tabla de base de datos (TypeORM); `task.model.ts` = formato que se devuelve al frontend (con `fromEntity`). |
| **Service + DataSource separados** | El service lleva lógica de negocio; el datasource lleva lógica de base de datos. Ambos inyectan una interfaz, no una implementación concreta. |
| **USE_DB variable** | Si `false` (default), usa `Map` en memoria — no necesita PostgreSQL ni Docker. Si `true`, usa TypeORM + PostgreSQL. Ideal para pruebas sin infraestructura. |
| **custom-response** | Estructura de respuesta uniforme en TODOS los endpoints: `{ type, message, data }` en éxito, `{ type, message }` en error. Copiado del patrón de `velox-backend`. |
| **PATCH (no PUT)** | La edición es parcial (se puede cambiar solo el estado), por lo tanto `PATCH` es semánticamente más correcto que `PUT`. |
| **PaginationDto base + customs** | `PaginationDto` y `PaginationWithSearchDto` copiados de `velox-backend`; herencias en `customs/` para endpoints específicos. |
| **Swagger en /api/docs** | UI con buscador, viene colapsado, con botón de export JSON. Redirección de `/api` a `/api/docs`. Patrón basado en `npc-backend-admin`. |

---

## ⏭️ Qué haría con más tiempo

- **Autenticación y autorización:** JWT, roles (admin/usuario), protección de endpoints.
- **PostgreSQL en Docker:** `docker-compose` para no depender de una base local instalada.
- **Tests unitarios del servicio** (mock de Prisma/TypeORM) además de los e2e.
- **Linting estricto:** ESLint + Prettier configurados y en pre-commit (husky).
- **CI/CD:** GitHub Actions que corra `build`, `test:e2e` y `lint` en cada push.
- **Swagger completo:** decoradores `@ApiOperation`, `@ApiResponse`, `@ApiBody`, `@ApiQuery` en todos los endpoints.
- **Paginación por cursor** para grandes volúmenes.
- **Filtros por fecha límite** (`dueDate` antes/después de).
- **Soft delete** en lugar de borrado físico.
- **Relación FK entre Task y Assignee** (integridad referencial).

---

## 🤖 Cómo se usó la IA

- **Qué se le pidió:**
  - Estructura de proyecto NestJS + TypeScript (módulos, servicios, controladores).
  - Ejemplo de DTOs con `class-validator` y `class-transformer`.
  - Configuración de TypeORM con PostgreSQL y entidades.
  - Patrón de respuesta uniforme (`custom-response`) basado en `velox-backend`.
  - Ejemplo de tests de integración con Jest + Supertest.
  - Configuración de Swagger (`@nestjs/swagger`) con buscador y export JSON.
  - Patrón entity/model, service+datasource separados.
- **Qué se aceptó:**
  - Nombres de rutas REST (`POST /tasks`, `GET /tasks/:id`, etc.) y códigos HTTP (201, 200, 204, 400, 404).
  - Estructura de carpetas (`src/modules/tasks/`, `src/modules/assignees/`, `src/common/`).
  - Boilerplate de configuración de TypeORM y Prisma.
  - Nombres de rutas, DTOs y servicios en inglés.
- **Qué se corrigió:**
  - `@nestjs/swagger` v12 es ESM puro y rompe Jest en CommonJS; se creó un mock para Jest.
  - `@nestjs/typeorm` también es ESM; se creó un mock para Jest.
  - `process.env.USE_DB` se leía antes de que `ConfigModule` cargara las variables; se cambió a lectura directa en `useFactory`.
  - `ValidationPipe` con `transform: true` causaba 400 en `@Param('id')`; se cambió a `transform: false` con conversión manual en el service.
  - `NotFoundException` de NestJS no se convertía a `ErrorResponse` con código 404; se agregó manejo explícito en `CustomResponse.handleResponse`.
  - `totalPages` era 0 cuando `total=0`; se corrigió para devolver 1.

---

## 📦 Scripts disponibles

```bash
pnpm run start:dev   # iniciar con watch (desarrollo)
pnpm run build       # compilación TypeScript (genera dist/)
pnpm start:prod      # ejecutar en producción (node dist/main)
pnpm test            # tests unitarios
pnpm test:e2e        # tests de integración (Jest + Supertest)
pnpm lint            # ESLint con autofix
```

---

## ✅ Requisitos del enunciado — Estado

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | CRUD de tareas (título, descripción, estado, responsable, fecha límite) | ✅ |
| 2 | Filtros por estado y responsable + paginación | ✅ |
| 3 | Validación y códigos HTTP correctos | ✅ |
| 4 | Base de datos PostgreSQL con migraciones (TypeORM) | ✅ |
| 4 (bis) | Entity = tabla BD, Model = formato frontend | ✅ |
| 4 (bis) | Service separado en service + datasource (interfaz + implementación real/local) | ✅ |
| 4 (ter) | Variable `USE_DB` en `.env`: si `false` usa in-memory Map, si `true` usa PostgreSQL | ✅ |
| 4 (cuar) | Módulo de responsables (assignees) con CRUD propio | ✅ |
| 5 | Al menos 3 tests | ✅ (29 tests) |
| 6 | README con ejecución, decisiones, qué haría con más tiempo, uso de IA | ✅ |
| Extra | Swagger con buscador + export JSON en `/api/docs` y `/api/docs/json` | ✅ |
| Extra | Respuesta uniforme con custom-response en todos los endpoints | ✅ |

---

**Autor:** Octavio  
**Entrega:** repositorio público en GitHub (enlace por enviar)  
**Tiempo estimado:** ~3 horas