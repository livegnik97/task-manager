import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AssigneesModule } from './modules/assignees/assignee.module';

describe('Assignees CRUD (e2e) - Iteración 3', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AssigneesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/assignees -> crea un responsable y devuelve 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/assignees')
      .send({ name: 'Ana García', email: 'ana@test.com' })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Ana García');
    expect(res.body.email).toBe('ana@test.com');
  });

  it('GET /api/assignees/:id -> devuelve 404 si el responsable no existe', async () => {
    await request(app.getHttpServer())
      .get('/api/assignees/11111111-1111-1111-1111-111111111111')
      .expect(404);
  });

  it('PATCH /api/assignees/:id -> edita un responsable y devuelve 200', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/assignees')
      .send({ name: 'Original', email: 'orig@test.com' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .patch(`/api/assignees/${created.body.id}`)
      .send({ name: 'Modificado', email: 'mod@test.com' })
      .expect(200);

    expect(res.body.name).toBe('Modificado');
    expect(res.body.email).toBe('mod@test.com');
  });

  it('DELETE /api/assignees/:id -> borra un responsable y devuelve 204', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/assignees')
      .send({ name: 'Para borrar', email: 'borrar@test.com' })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/api/assignees/${created.body.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/api/assignees/${created.body.id}`)
      .expect(404);
  });

  it('GET /api/assignees vacía -> devuelve 200 con data vacía y paginación', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/assignees')
      .expect(200);

    expect(res.body.data).toHaveLength(0);
    expect(res.body.total).toBe(0);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
  });

  it('POST /api/assignees sin name -> devuelve 400', async () => {
    await request(app.getHttpServer())
      .post('/api/assignees')
      .send({ email: 'test@test.com' })
      .expect(400);
  });
});
