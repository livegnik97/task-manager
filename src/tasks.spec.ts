import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TasksModule } from './modules/tasks/tasks.module';
import { AssigneesModule } from './modules/assignees/assignee.module';

describe('Tasks CRUD (e2e) - Iteración 2', () => {
  let app: INestApplication;
  let assigneeId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TasksModule, AssigneesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // Crear un assignee para usar en las tareas
    const res = await request(app.getHttpServer())
      .post('/api/assignees')
      .send({ name: 'Octavio', email: 'octavio@test.com' })
      .expect(201);
    assigneeId = res.body.id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/tasks -> crea una tarea y devuelve 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/tasks')
      .send({
        title: 'Comprar leche',
        description: 'Leche entera 1 litro',
        status: 'PENDING',
        assigneeId,
        dueDate: '2026-12-01T10:00:00Z',
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe('Comprar leche');
    expect(res.body.status).toBe('PENDING');
    expect(res.body.assigneeId).toBe(assigneeId);
    expect(res.body.assigneeName).toBe('Octavio');
  });

  it('GET /api/tasks/:id -> devuelve 404 si la tarea no existe', async () => {
    await request(app.getHttpServer())
      .get('/api/tasks/11111111-1111-1111-1111-111111111111')
      .expect(404);
  });

  it('PATCH /api/tasks/:id -> edita una tarea y devuelve 200', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'Tarea original', status: 'PENDING', assigneeId })
      .expect(201);

    const res = await request(app.getHttpServer())
      .patch(`/api/tasks/${created.body.id}`)
      .send({ status: 'DONE', title: 'Tarea editada' })
      .expect(200);

    expect(res.body.status).toBe('DONE');
    expect(res.body.title).toBe('Tarea editada');
  });

  it('DELETE /api/tasks/:id -> borra una tarea y devuelve 204', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'Para borrar', status: 'PENDING', assigneeId })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/api/tasks/${created.body.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/api/tasks/${created.body.id}`)
      .expect(404);
  });

  it('GET /api/tasks vacía -> devuelve 200 con data vacía y paginación', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/tasks')
      .expect(200);

    expect(res.body.data).toHaveLength(0);
    expect(res.body.total).toBe(0);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
  });

  it('GET /api/tasks con filtro assigneeId', async () => {
    await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'T1', status: 'PENDING', assigneeId })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'T2', status: 'DONE', assigneeId })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/tasks')
      .query({ assigneeId, page: 1, limit: 10 })
      .expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.total).toBe(2);
    expect(res.body.totalPages).toBe(1);
  });
});
