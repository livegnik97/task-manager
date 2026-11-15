# Plan de Implementación — Backend Task Manager (NestJS + TypeORM + PostgreSQL)

Base: lógica y estructura de `/Users/octagi/Coding/NestJs/@projects/lily-prima/velox-backend`.
Regla: **un commit por iteración**, no se avanza a la siguiente sin commitear la anterior.

Stack: Node.js + TypeScript + NestJS + TypeORM + PostgreSQL (puerto 5433, DB `task_manager_db`, credenciales de `velox-backend`).
Regla de commits: cada iteración termina con su propio `git commit`.

---

## Estructura de carpetas propuesta (siguiendo velox-backend)

```
src/
  modules/
    tasks/
      entities/          # Tabla de base de datos (TypeORM Entity)
        task.entity.ts
      models/            # Formato que se devuelve al frontend
        task.model.ts
      dto/               # DTOs de entrada / salida
        create-task.dto.ts
        update-task.dto.ts
        task-query.dto.ts   (paginación + filtros)
      datasource/        # Contrato e implementaciones del datasource
        task-datasource.interface.ts   # Interfaz/clase abstracta con métodos abstractos
        task-datasource.ts             # Implementación TypeORM (PostgreSQL)
        task-datasource.local.ts       # Implementación in-memory (Map) para modo local sin BD
      tasks.service.ts       # Logica de negocio (inyecta la interfaz, no la implementación concreta)
      tasks-datasource.module.ts   # Factory/conditional: según USE_DB inyecta real o local
      tasks.module.ts
      tasks.controller.ts
    assignees/             # Módulo de responsables de tareas (nuevo)
      entities/          # Tabla de base de datos (TypeORM Entity)
        assignee.entity.ts
      models/            # Formato que se devuelve al frontend
        assignee.model.ts
      dto/               # DTOs de entrada / salida
        create-assignee.dto.ts
        update-assignee.dto.ts
        assignee-query.dto.ts   (paginación + filtros opcionales)
      datasource/        # Contrato e implementaciones del datasource
        assignee-datasource.interface.ts   # Interfaz/clase abstracta con métodos abstractos
        assignee-datasource.ts             # Implementación TypeORM (PostgreSQL)
        assignee-datasource.local.ts       # Implementación in-memory (Map) para modo local sin BD
      assignee.service.ts       # Logica de negocio (inyecta la interfaz)
      assignee-datasource.module.ts   # Factory/conditional: según USE_DB inyecta real o local
      assignee.module.ts
      assignee.controller.ts
  config/
    data-source.ts         # AppDataSource (TypeORM DataSource, solo se inicializa si USE_DB=true)
  common/
    custom-response/       # Estructura de respuesta uniforme (copiado de velox-backend)
      custom-response-type.ts    # Enum CustomResponseType
      custom-response.ts         # Clase CustomResponse (handleResponse)
      entities/
        my-response.ts           # Abstracta: toJSON(), getCode()
        success-response.ts      # SuccessResponse<T> -> { type, message, data }
        error-response.ts        # ErrorResponse -> { type, message }
    models/
      pagination.model.ts    # Copiado de velox-backend (PaginationModel<T> + ApiPaginatedResponse)
    pagination-dtos/
      customs/
        tasks-pagination.dto.ts  # DTO de paginación y filtros (page, limit, status, assignee)
        assignees-pagination.dto.ts  # DTO de paginación para assignees (page, limit)
  main.ts
  app.module.ts
```

Convenciones clave (copiadas de velox-backend):

**custom-response (respuesta uniforme en TODOS los endpoints):**
- `my-response.ts`: abstracta con `toJSON()` y `getCode()`.
- `success-response.ts`: `SuccessResponse<T>` con `code` (default 200), `type`, `message`, `data`. `toJSON()` devuelve `{ type, message, data }` (o solo `data` si no hay type/message). `static build()`.
- `error-response.ts`: `ErrorResponse` con `code` (default 400), `type`, `message`. `toJSON()` devuelve `{ type, message }`. `static build()`.
- `custom-response-type.ts`: enum con `unknown_error`, `error`, `create_error`, `already_exists`, `not_found`, `empty_fields`, `invalid_field`.
- `custom-response.ts`: `CustomResponse.handleResponse(res, fun)` — ejecuta `fun()`, captura errores y responde `res.status(code).json(myResponse.toJSON())`. Cada endpoint del controlador debe usar este wrapper para mantener siempre la misma estructura de respuesta.

**Entity / Model / Datasource / Service (para cada módulo: tasks y assignees):**
- `entities/<module>.entity.ts`: decoradores `@Entity`, `@PrimaryGeneratedColumn`, `@Column`, `@CreateDateColumn`, `@UpdateDateColumn`.
- `models/<module>.model.ts`: constructor, campos con `@ApiProperty()`, método estático `fromEntity(entity): <Module>Model`.
- `datasource/<module>-datasource.interface.ts`: interfaz o clase abstracta con los métodos abstractos (`findAll`, `findOne`, `create`, `update`, `remove`). Sirve como contrato para inyectar en el service sin saber si es BD real o local.
- `datasource/<module>-datasource.ts`: implementación TypeORM/PostgreSQL. Inyecta `@InjectRepository(<Module>)`. Devuelve `<Module>Model | null` o `PaginationModel<<Module>Model>`.
- `datasource/<module>-datasource.local.ts`: implementación in-memory. Guarda en un `Map<string, <Module>>` mientras se ejecuta el backend. Implementa la misma interfaz. No requiere base de datos.
- `<module>.service.ts`: inyecta la interfaz (no la implementación concreta). Según `USE_DB`, el module proporciona la implementación real o la local. Aplica lógica de negocio, valida, devuelve `<Module>Model` o lanza errores HTTP.
- `<module>-datasource.module.ts`: factory/conditional. Lee `process.env.USE_DB`. Si es `true`, importa y proporciona `<Module>DataSource` (TypeORM). Si es `false` o no está definido, proporciona `<Module>DataSourceLocal` (Map en memoria).
- `pagination.model.ts`: clase `PaginationModel<T>` con `static build()` y `static empty()`, más `ApiPaginatedResponse(model)`.

---

## Iteración 1 — Config TypeORM, Entity, Model, DTOs, Custom-Response y Datasource Interface (Tasks + Assignees)

**Objetivo:** Tener TypeORM conectado a PostgreSQL (`task_manager_db`), las entidades `Task` y `Assignee` mapeadas, sus modelos para el frontend, los DTOs, la carpeta `custom-response` con respuesta uniforme, la interfaz de datasource y la implementación in-memory local, y la configuración de base de datos.

**Qué se va a hacer:**
1. Instalar dependencias: `@nestjs/typeorm`, `typeorm`, `pg`, `@nestjs/config`, `class-validator`, `class-transformer`, `@nestjs/swagger`, `swagger-ui-express`, `uuid`.
2. Agregar variable `USE_DB=false` en `.env` (para modo local sin BD por defecto en pruebas).
3. Crear `src/config/data-source.ts` con `AppDataSource` (type: postgres, host localhost, puerto 5433, user root, password postgres, database task_manager_db, entities, synchronize: true en dev). Solo se inicializa si `USE_DB=true`.
4. Crear `src/common/custom-response/custom-response-type.ts` (enum `CustomResponseType`).
5. Crear `src/common/custom-response/entities/my-response.ts` (abstracta).
6. Crear `src/common/custom-response/entities/success-response.ts` (`SuccessResponse<T>`).
7. Crear `src/common/custom-response/entities/error-response.ts` (`ErrorResponse`).
8. Crear `src/common/custom-response/custom-response.ts` (`CustomResponse.handleResponse`).
9. Crear `src/common/models/pagination.model.ts` (clase `PaginationModel<T>` + `ApiPaginatedResponse`).
10. Crear `src/common/pagination-dtos/customs/tasks-pagination.dto.ts` (page, limit, status, assignee).
11. Crear `src/common/pagination-dtos/customs/assignees-pagination.dto.ts` (page, limit).
12. Crear `src/modules/tasks/entities/task.entity.ts` (id uuid, title, description, status enum PENDING/IN_PROGRESS/DONE, assignee, dueDate, createdAt, updatedAt).
13. Crear `src/modules/tasks/models/task.model.ts` (id, title, description, status, assignee, dueDate, createdAt; `static fromEntity`).
14. Crear `src/modules/tasks/datasource/task-datasource.interface.ts` (interfaz/clase abstracta con métodos abstractos: `findAll`, `findOne`, `create`, `update`, `remove`).
15. Crear `src/modules/tasks/datasource/task-datasource.local.ts` (implementación in-memory con `Map<string, Task>`, sin BD).
16. Crear `src/modules/assignees/entities/assignee.entity.ts` (id uuid, name, email, createdAt, updatedAt).
17. Crear `src/modules/assignees/models/assignee.model.ts` (id, name, email, createdAt; `static fromEntity`).
18. Crear `src/modules/assignees/datasource/assignee-datasource.interface.ts` (interfaz/clase abstracta con métodos abstractos).
19. Crear `src/modules/assignees/datasource/assignee-datasource.local.ts` (implementación in-memory con `Map<string, Assignee>`, sin BD).
20. Crear `src/modules/tasks/tasks-datasource.module.ts` (factory: lee `USE_DB`, si true proporciona `TaskDataSource` TypeORM, si false proporciona `TaskDataSourceLocal`).
21. Crear `src/modules/assignees/assignee-datasource.module.ts` (factory: lee `USE_DB`, si true proporciona `AssigneeDataSource` TypeORM, si false proporciona `AssigneeDataSourceLocal`).
22. Configurar `src/app.module.ts` con `ConfigModule.forRoot()` y condicionalmente `TypeOrmModule.forRoot()` solo si `USE_DB=true`.
23. Verificar `npx tsc --noEmit` limpio.
24. `git commit -m "feat(iter1): TypeORM config, custom-response, Task/Assignee entity/model/DTOs, datasource interface + local/real implementations, module factories"`.

**Tests que se le van a aplicar:**
- Test de compilación: `npx tsc --noEmit` sin errores.
- Test de modo local Task: instanciar `TaskDataSourceLocal` y verificar `create`+`findOne` con Map en memoria sin BD.
- Test de modo local Assignee: instanciar `AssigneeDataSourceLocal` y verificar `create`+`findOne` con Map en memoria sin BD.
- Test de conexión (opcional, solo si `USE_DB=true`): script que instancie `AppDataSource.initialize()` y haga `query("SELECT 1")` exitoso.

---

## Iteración 2 — CRUD de Tareas (DataSource real + Service + Controller)

**Objetivo:** Implementar la lógica de base de datos (datasource TypeORM) y la lógica de negocio (service) con los 5 operaciones CRUD para tareas.

**Qué se va a hacer:**
1. Crear `src/modules/tasks/datasource/task-datasource.ts` (implementación TypeORM/PostgreSQL):
   - `@InjectRepository(Task)`.
   - `findAll(query)` → usa `createQueryBuilder`, aplica filtros `status` y `assignee`, paginación `skip`/`take`, devuelve `PaginationModel<TaskModel>`.
   - `findOne(id)` → devuelve `Task | null`.
   - `create(data)` → guarda y devuelve `TaskModel | null`.
   - `update(id, data)` → actualiza y devuelve `TaskModel | null`.
   - `remove(id)` → borra y devuelve booleano o `TaskModel | null`.
   Implementa `task-datasource.interface.ts`.
2. Crear `src/modules/tasks/tasks.service.ts`:
   - Inyecta la interfaz `TaskDataSourceInterface` (no la implementación concreta).
   - `create`, `findAll`, `findOne`, `update`, `remove` con lógica de negocio.
   - Validaciones: título requerido, estado válido (PENDING/IN_PROGRESS/DONE).
   - Lanza `NotFoundException` (404) si no existe; `BadRequestException` (400) si validación falla.
3. Crear `src/modules/tasks/tasks.module.ts` (imports: `TasksDataSourceModule`; providers: `TasksService`; exports: `TasksService`).
4. Crear `src/modules/tasks/tasks.controller.ts`:
   - Cada endpoint usa `CustomResponse.handleResponse(res, () => this.tasksService.xxx())` para devolver siempre `{ type, message, data }` o `{ type, message }`.
   - `POST /tasks` → 201
   - `GET /tasks` → 200 (paginado)
   - `GET /tasks/:id` → 200 / 404
   - `PATCH /tasks/:id` → 200 / 404
   - `DELETE /tasks/:id` → 204 / 404
5. Registrar `TasksModule` en `src/app.module.ts`.
6. `git commit -m "feat(iter2): CRUD Tasks con DataSource TypeORM + Service + Controller con custom-response"`.

**Tests que se le van a aplicar (e2e con Supertest, modo local `USE_DB=false`):**
- `POST /tasks` válido → 201, devuelve `TaskModel` con id.
- `GET /tasks/:id` inexistente → 404 con `{ type, message }`.
- `PATCH /tasks/:id` válido → 200, campos actualizados.
- `DELETE /tasks/:id` válido → 204, GET posterior → 404.
- `GET /tasks` vacío → 200 con `data: []` y metadatos de paginación.

---

## Iteración 3 — CRUD de Responsables / Assignees (DataSource real + Service + Controller)

**Objetivo:** Implementar el módulo de responsables (`assignees`) con CRUD completo, siguiendo el mismo patrón entity/model, service+datasource separado, custom-response y USE_DB.

**Qué se va a hacer:**
1. Crear `src/modules/assignees/datasource/assignee-datasource.ts` (implementación TypeORM/PostgreSQL):
   - `@InjectRepository(Assignee)`.
   - `findAll(query)` → paginación `skip`/`take`, devuelve `PaginationModel<AssigneeModel>`.
   - `findOne(id)` → devuelve `Assignee | null`.
   - `create(data)` → guarda y devuelve `AssigneeModel | null`.
   - `update(id, data)` → actualiza y devuelve `AssigneeModel | null`.
   - `remove(id)` → borra y devuelve booleano o `AssigneeModel | null`.
   Implementa `assignee-datasource.interface.ts`.
2. Crear DTOs: `create-assignee.dto.ts`, `update-assignee.dto.ts` con validación `class-validator` (nombre requerido, email opcional pero válido si se envía).
3. Crear `src/modules/assignees/assignee.service.ts`:
   - Inyecta la interfaz `AssigneeDataSourceInterface`.
   - `create`, `findAll`, `findOne`, `update`, `remove` con lógica de negocio.
   - Validaciones: nombre requerido, email único (opcional).
   - Lanza `NotFoundException` (404) si no existe; `BadRequestException` (400) si validación falla.
4. Crear `src/modules/assignees/assignee.module.ts` (imports: `AssigneesDataSourceModule`; providers: `AssigneeService`; exports: `AssigneeService`).
5. Crear `src/modules/assignees/assignee.controller.ts`:
   - Cada endpoint usa `CustomResponse.handleResponse(res, () => this.assigneeService.xxx())`.
   - `POST /assignees` → 201
   - `GET /assignees` → 200 (paginado)
   - `GET /assignees/:id` → 200 / 404
   - `PATCH /assignees/:id` → 200 / 404
   - `DELETE /assignees/:id` → 204 / 404
6. Registrar `AssigneesModule` en `src/app.module.ts`.
7. `git commit -m "feat(iter3): CRUD Assignees con DataSource TypeORM + Service + Controller con custom-response"`.

**Tests que se le van a aplicar (e2e con Supertest, modo local `USE_DB=false`):**
- `POST /assignees` válido → 201, devuelve `AssigneeModel` con id.
- `GET /assignees/:id` inexistente → 404 con `{ type, message }`.
- `PATCH /assignees/:id` válido → 200, campos actualizados.
- `DELETE /assignees/:id` válido → 204, GET posterior → 404.
- `GET /assignees` vacío → 200 con `data: []` y metadatos de paginación.
- `POST /assignees` sin `name` → 400 con `{ type, message }`.

---

## Iteración 4 — Controlador, Validación, Filtros y Paginación (Tasks y Assignees)

**Objetivo:** Exponer los endpoints con validación de datos, filtros por estado y responsable, paginación con metadatos, y Swagger con buscador + export JSON.

**Qué se va a hacer:**
1. Aplicar `ValidationPipe` global en `src/main.ts` (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`).
2. Añadir decoradores `class-validator` a `CreateTaskDto` y `UpdateTaskDto` (`@IsString`, `@IsNotEmpty`, `@IsEnum`, `@IsOptional`, `@IsDateString`).
3. Añadir decoradores `class-validator` a `CreateAssigneeDto` y `UpdateAssigneeDto` (`@IsString`, `@IsNotEmpty`, `@IsOptional`, `@IsEmail`).
4. Añadir decoradores a `tasks-pagination.dto.ts` y `assignees-pagination.dto.ts` (`@IsInt`, `@Min`, `@Max`, `@Type(() => Number)`).
5. Validación manual en servicios (título no vacío, estado válido, nombre de assignee requerido, page/limit numéricos) para garantizar 400 confiable.
6. Códigos HTTP correctos: 201 crear, 200 ok, 204 borrar, 400 validación, 404 no encontrado.
7. Swagger en `main.ts` (patrón de `npc-backend-admin`):
   - `app.setGlobalPrefix('api')` — todas las rutas bajo `/api`.
   - `DocumentBuilder` con título, descripción, versión.
   - `SwaggerModule.setup('api/docs', app, document, { jsonDocumentUrl: '/api/docs/json', swaggerOptions: { docExpansion: 'none', filter: true }, customSiteTitle: 'Task Manager API Docs' })` — UI en `/api/docs`, viene colapsada (`docExpansion: 'none'`), con buscador (`filter: true`), y endpoint JSON en `/api/docs/json`.
   - `customJsStr` para inyectar un botón "JSON" en la barra superior que apunte a `/api/docs/json`.
   - Redirect de la raíz: al entrar a `/api` (o `/`) redirigir automáticamente a `/api/docs`.
8. Añadir decoradores `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBody`, `@ApiQuery` en controladores y DTOs de ambos módulos (usando `TaskModel`, `AssigneeModel` y `ApiPaginatedResponse`).
9. Verificar `/api/docs` (UI con buscador, colapsado) y `/api/docs/json` (JSON descargable).
10. `git commit -m "feat(iter4): validación, filtros, paginación y Swagger en /api/docs para Tasks y Assignees"`.

**Tests que se le van a aplicar (e2e):**
- `POST /tasks` sin `title` → 400 con `{ type, message }`.
- `POST /tasks` con `status` inválido → 400 con `{ type, message }`.
- `GET /tasks?page=abc` → 400 con `{ type, message }`.
- `GET /tasks?status=PENDING&assignee=Ana&limit=1` → exactamente 1 ítem, `meta.totalPages` correcto.
- `POST /assignees` sin `name` → 400 con `{ type, message }`.
- `GET /api/docs` → 200 (HTML Swagger UI, colapsado, con buscador).
- `GET /api/docs/json` → 200, `content-type: application/json`, OpenAPI válido.
- Redirect raíz: `GET /api` → redirige a `/api/docs` (301/302).

---

## Iteración 5 — Tests de integración (mínimo 3 por módulo)

**Objetivo:** Tener al menos 3 tests de integración aprobados por módulo contra la API real (modo local).

**Qué se va a hacer:**
1. Crear `test/tasks.e2e-spec.ts` con Jest + Supertest.
2. Crear `test/assignees.e2e-spec.ts` con Jest + Supertest.
3. Configurar `test/jest-e2e.json` (rootDir, testRegex, transform ts-jest).
4. Antes de cada test: limpiar tablas `tasks` y `assignees` (repository o Map.clear() en modo local).
5. Escribir al menos 3 tests por módulo:
   - Tasks: crear (201), ver inexistente (404), editar (200), borrar (204), validación (400), filtro+paginación.
   - Assignees: crear (201), ver inexistente (404), editar (200), borrar (204), validación (400).
6. Ejecutar `pnpm test:e2e` y verificar que todos pasan.
7. `git commit -m "feat(iter5): tests de integración Jest + Supertest para Tasks y Assignees"`.

**Tests que se le van a aplicar:** mínimo 3 por módulo (6 en total como mínimo).

---

## Iteración 6 — README, build y repositorio público

**Objetivo:** Documentar todo y dejar el repo listo para entrega en GitHub.

**Qué se va a hacer:**
1. Ejecutar `pnpm run build` y verificar que genera `dist/` sin errores.
2. Ejecutar `pnpm test:e2e` y verificar 100% de tests pasando.
3. Escribir `README.md` con:
   - Cómo ejecutarlo (instalar, sincronizar BD, variables de entorno `USE_DB`, iniciar).
   - Decisiones tomadas (NestJS vs Express, TypeORM vs Prisma, PostgreSQL, entity/model separados, service+datasource separados con interfaz, custom-response uniforme, USE_DB modo local/BD, PATCH vs PUT, paginación, módulo de assignees).
   - Qué haría con más tiempo (auth JWT, Docker, tests unitarios, ESLint/CI, soft delete, filtros por fecha, relación FK entre Task y Assignee).
   - Cómo se usó la IA (qué se le pidió, qué se aceptó, qué se corrigió).
   - Endpoints y Swagger (`/api` UI con buscador, `/api-json` JSON).
4. Crear repositorio público en GitHub, subir código, compartir enlace.
5. `git commit -m "feat(iter6): README, build verificado y repo listo para entrega"`.

**Tests que se le van a aplicar:**
- `pnpm run build` sin errores.
- `pnpm test:e2e` → todos los tests pasan.
- `GET /tasks` salud → 200.
- `GET /assignees` salud → 200.

---

## Requisitos del enunciado — estado planificado

| # | Requisito | Iteración |
|---|-----------|-----------|
| 1 | CRUD tareas (título, descripción, estado, responsable, fecha límite) | 2 |
| 2 | Filtros por estado y responsable + paginación | 4 |
| 3 | Validación y códigos HTTP correctos | 4 |
| 4 | PostgreSQL con migraciones (TypeORM synchronize / migraciones) | 1 |
| 4 (bis) | Entity = tabla BD, Model = formato frontend | 1 |
| 4 (bis) | Service separado en service + datasource (interfaz + implementación real/local) | 1, 2, 3 |
| 4 (ter) | Variable `USE_DB` en `.env`: si `false` usa in-memory Map, si `true` usa PostgreSQL | 1 |
| 4 (cuar) | Módulo de responsables (assignees) con CRUD propio | 3 |
| 5 | Al menos 3 tests | 5 |
| 6 | README con ejecución, decisiones, qué haría con más tiempo, uso de IA | 6 |
| Extra | Respuesta uniforme con custom-response en todos los endpoints | 1, 2, 3, 4 |
| Extra | Swagger con buscador + export JSON | 4 |
