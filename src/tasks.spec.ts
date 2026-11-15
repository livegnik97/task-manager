import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TasksModule } from './modules/tasks/tasks.module';

describe('Tasks CRUD (e2e) - Iteración 2', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
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
        assignee: 'Octavio',
        dueDate: '2026-12-01T10:00:00Z',
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe('Comprar leche');
    expect(res.body.status).toBe('PENDING');
    expect(res.body.assignee).toBe('Octavio');
  });

  it('GET /api/tasks/:id -> devuelve 404 si la tarea no existe', async () => {
    await request(app.getHttpServer())
      .get('/api/tasks/11111111-1111-1111-1111-111111111111')
      .expect(404);
  });

  it('PATCH /api/tasks/:id -> edita una tarea y devuelve 200', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'Tarea original', status: 'PENDING' })
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
      .send({ title: 'Para borrar', status: 'PENDING' })
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
});
