import { Injectable } from '@nestjs/common';
import { TaskDataSourceInterface } from './task-datasource.interface';
import { TaskModel } from '../models/task.model';
import { TaskStatus, Task } from '../entities/task.entity';
import { TasksPaginationDto } from '../../../common/pagination-dtos/customs/tasks-pagination.dto';
import { PaginationModel } from '../../../common/models/pagination.model';

@Injectable()
export class TaskDataSourceLocal extends TaskDataSourceInterface {
  private readonly tasks = new Map<string, Task>();

  async findAll(query: TasksPaginationDto): Promise<PaginationModel<TaskModel>> {
    let items = Array.from(this.tasks.values());

    if (query.status) {
      items = items.filter((t) => String(t.status) === String(query.status));
    }

    if (query.assignee) {
      items = items.filter((t) => t.assignee === query.assignee);
    }

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const skip = (page - 1) * limit;
    const total = items.length;
    const pagedItems = items.slice(skip, skip + limit).map((t) =>
      TaskModel.fromEntity(t),
    );

    return PaginationModel.build({
      page,
      limit,
      total,
      data: pagedItems,
    });
  }

  async findOne(id: string): Promise<TaskModel | null> {
    const task = this.tasks.get(id);
    if (!task) return null;
    return TaskModel.fromEntity(task);
  }

  async create(data: {
    title: string;
    description?: string;
    status?: string;
    assignee?: string;
    dueDate?: string;
  }): Promise<TaskModel | null> {
    const id = crypto.randomUUID();
    const task: Task = {
      id,
      title: data.title,
      description: data.description ?? null,
      status: (data.status ?? TaskStatus.PENDING) as TaskStatus,
      assignee: data.assignee ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, task);
    return TaskModel.fromEntity(task);
  }

  async update(
    id: string,
    data: Partial<TaskModel>,
  ): Promise<TaskModel | null> {
    const task = this.tasks.get(id);
    if (!task) return null;

    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.status !== undefined) task.status = data.status as TaskStatus;
    if (data.assignee !== undefined) task.assignee = data.assignee;
    if (data.dueDate !== undefined) {
      task.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    task.updatedAt = new Date();
    this.tasks.set(id, task);
    return TaskModel.fromEntity(task);
  }

  async remove(id: string): Promise<boolean | null> {
    const exists = this.tasks.has(id);
    if (!exists) return null;
    this.tasks.delete(id);
    return true;
  }
}
