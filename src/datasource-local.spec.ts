import { Test } from '@nestjs/testing';
import { TaskDataSourceLocal } from './modules/tasks/datasource/task-datasource.local';
import { AssigneeDataSourceLocal } from './modules/assignees/datasource/assignee-datasource.local';
import { TaskStatus } from './modules/tasks/entities/task.entity';
import { TaskStatusFilter, TasksPaginationDto } from './common/pagination-dtos/customs/tasks-pagination.dto';
import { AssigneesPaginationDto } from './common/pagination-dtos/customs/assignees-pagination.dto';

describe('TaskDataSourceLocal (modo local sin BD)', () => {
  let ds: TaskDataSourceLocal;
  let assigneeDs: AssigneeDataSourceLocal;

  beforeEach(() => {
    assigneeDs = new AssigneeDataSourceLocal();
    ds = new TaskDataSourceLocal(assigneeDs);
  });

  it('debe crear una tarea y encontrarla por ID', async () => {
    const assignee = await assigneeDs.create({ name: 'Ana García', email: 'ana@test.com' });

    const created = await ds.create({
      title: 'Tarea de prueba',
      description: 'Descripción prueba',
      status: 'PENDING',
      assigneeId: assignee!.id,
      dueDate: '2026-12-01T10:00:00Z',
    });

    expect(created).not.toBeNull();
    expect(created!.id).toBeDefined();
    expect(created!.title).toBe('Tarea de prueba');
    expect(created!.status).toBe(TaskStatus.PENDING);
    expect(created!.assigneeId).toBe(assignee!.id);
    expect(created!.assigneeName).toBe('Ana García');

    const found = await ds.findOne(created!.id);
    expect(found).not.toBeNull();
    expect(found!.title).toBe('Tarea de prueba');
  });

  it('debe devolver null al crear tarea con assignee inexistente', async () => {
    const created = await ds.create({
      title: 'Tarea sin assignee válido',
      assigneeId: 'id-inexistente',
    });
    expect(created).toBeNull();
  });

  it('debe devolver null al buscar tarea inexistente', async () => {
    const found = await ds.findOne('id-inexistente');
    expect(found).toBeNull();
  });

  it('debe listar tareas con paginación y filtros', async () => {
    const a1 = await assigneeDs.create({ name: 'Ana', email: 'ana@test.com' });
    const a2 = await assigneeDs.create({ name: 'Luis', email: 'luis@test.com' });

    await ds.create({ title: 'T1', status: 'PENDING', assigneeId: a1!.id });
    await ds.create({ title: 'T2', status: 'DONE', assigneeId: a1!.id });
    await ds.create({ title: 'T3', status: 'PENDING', assigneeId: a2!.id });

    const query = new TasksPaginationDto();
    query.status = TaskStatusFilter.PENDING;
    query.assigneeId = a1!.id;
    query.page = 1;
    query.limit = 10;

    const result = await ds.findAll(query);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('debe actualizar una tarea existente', async () => {
    const assignee = await assigneeDs.create({ name: 'Original', email: 'orig@test.com' });
    const created = await ds.create({ title: 'Original', status: 'PENDING' });

    const updated = await ds.update(created!.id, { status: TaskStatus.DONE, title: 'Modificada', assigneeId: assignee!.id });
    expect(updated).not.toBeNull();
    expect(updated!.status).toBe(TaskStatus.DONE);
    expect(updated!.title).toBe('Modificada');
    expect(updated!.assigneeId).toBe(assignee!.id);
  });

  it('debe devolver null al actualizar tarea inexistente', async () => {
    const updated = await ds.update('id-inexistente', { title: 'X' });
    expect(updated).toBeNull();
  });

  it('debe borrar una tarea existente', async () => {
    const created = await ds.create({ title: 'Para borrar' });

    const removed = await ds.remove(created!.id);
    expect(removed).toBe(true);

    const found = await ds.findOne(created!.id);
    expect(found).toBeNull();
  });

  it('debe devolver null al borrar tarea inexistente', async () => {
    const removed = await ds.remove('id-inexistente');
    expect(removed).toBeNull();
  });
});

describe('AssigneeDataSourceLocal (modo local sin BD)', () => {
  let ds: AssigneeDataSourceLocal;

  beforeEach(() => {
    ds = new AssigneeDataSourceLocal();
  });

  it('debe crear un responsable y encontrarlo por ID', async () => {
    const created = await ds.create({ name: 'Ana García', email: 'ana@test.com' });

    expect(created).not.toBeNull();
    expect(created!.id).toBeDefined();
    expect(created!.name).toBe('Ana García');
    expect(created!.email).toBe('ana@test.com');

    const found = await ds.findOne(created!.id);
    expect(found).not.toBeNull();
    expect(found!.name).toBe('Ana García');
  });

  it('debe devolver null al buscar responsable inexistente', async () => {
    const found = await ds.findOne('id-inexistente');
    expect(found).toBeNull();
  });

  it('debe listar responsables con paginación y búsqueda', async () => {
    await ds.create({ name: 'Ana García', email: 'ana@test.com' });
    await ds.create({ name: 'Luis Pérez', email: 'luis@test.com' });
    await ds.create({ name: 'María López', email: 'maria@test.com' });

    const query = new AssigneesPaginationDto();
    query.search = 'ana';
    query.page = 1;
    query.limit = 10;

    const result = await ds.findAll(query);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('debe actualizar un responsable existente', async () => {
    const created = await ds.create({ name: 'Original', email: 'orig@test.com' });

    const updated = await ds.update(created!.id, { name: 'Modificado' });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe('Modificado');
  });

  it('debe borrar un responsable existente', async () => {
    const created = await ds.create({ name: 'Para borrar' });

    const removed = await ds.remove(created!.id);
    expect(removed).toBe(true);

    const found = await ds.findOne(created!.id);
    expect(found).toBeNull();
  });
});
