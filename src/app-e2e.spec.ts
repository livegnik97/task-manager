import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';

describe('AppModule full (e2e) - Iteración 4', () => {
  let app: INestApplication;
  let assigneeId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  it('POST /api/tasks -> crea tarea y devuelve 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'Test task', status: 'PENDING', assigneeId })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe('Test task');
    expect(res.body.assigneeId).toBe(assigneeId);
    expect(res.body.assigneeName).toBe('Octavio');
  });

  it('GET /api/tasks con filtro status + assigneeId y paginación', async () => {
    await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'T1', status: 'PENDING', assigneeId })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'T2', status: 'PENDING', assigneeId })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'T3', status: 'DONE', assigneeId })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/tasks')
      .query({ status: 'PENDING', assigneeId, page: 1, limit: 1 })
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].assigneeId).toBe(assigneeId);
    expect(res.body.data[0].status).toBe('PENDING');
    expect(res.body.total).toBe(2);
    expect(res.body.totalPages).toBe(2);
  });

  it('POST /api/tasks sin title -> devuelve 400', async () => {
    await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ description: 'No title' })
      .expect(400);
  });

  it('POST /api/tasks con assigneeId inexistente -> devuelve 400', async () => {
    await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'Tarea', assigneeId: '11111111-1111-1111-1111-111111111111' })
      .expect(400);
  });

  it('POST /api/assignees -> crea responsable y devuelve 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/assignees')
      .send({ name: 'Ana García', email: 'ana@test.com' })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Ana García');
  });

  it('GET /api/assignees con paginación y búsqueda', async () => {
    await request(app.getHttpServer())
      .post('/api/assignees')
      .send({ name: 'Ana García', email: 'ana@test.com' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/assignees')
      .send({ name: 'Luis Pérez', email: 'luis@test.com' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/assignees')
      .query({ search: 'ana', page: 1, limit: 10 })
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Ana García');
    expect(res.body.total).toBe(1);
  });
});
