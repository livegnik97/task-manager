import { Injectable } from '@nestjs/common';
import { TaskDataSourceInterface } from './task-datasource.interface';
import { TaskModel } from '../models/task.model';
import { TaskStatus, Task } from '../entities/task.entity';
import { TasksPaginationDto } from '../../../common/pagination-dtos/customs/tasks-pagination.dto';
import { PaginationModel } from '../../../common/models/pagination.model';
import { AssigneeDataSourceInterface } from '../../assignees/datasource/assignee-datasource.interface';
import { AssigneeModel } from '../../assignees/models/assignee.model';

@Injectable()
export class TaskDataSourceLocal extends TaskDataSourceInterface {
  private readonly tasks = new Map<string, Task>();

  constructor(
    private readonly assigneeDataSource: AssigneeDataSourceInterface,
  ) {
    super();
  }

  private async toModel(task: Task): Promise<TaskModel> {
    let assigneeName: string | null = null;
    if (task.assigneeId) {
      const assignee = await this.assigneeDataSource.findOne(task.assigneeId);
      if (assignee) {
        assigneeName = assignee.name;
      }
    }
    return new TaskModel(
      task.id,
      task.title,
      task.description,
      task.status,
      task.assigneeId,
      assigneeName,
      task.dueDate,
      task.createdAt,
    );
  }

  async findAll(query: TasksPaginationDto): Promise<PaginationModel<TaskModel>> {
    let items = Array.from(this.tasks.values());

    if (query.status) {
      items = items.filter((t) => String(t.status) === String(query.status));
    }

    if (query.assigneeId) {
      items = items.filter((t) => t.assigneeId === query.assigneeId);
    }

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const skip = (page - 1) * limit;
    const total = items.length;
    const pagedItems = await Promise.all(
      items.slice(skip, skip + limit).map((t) => this.toModel(t)),
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
    return this.toModel(task);
  }

  async create(data: {
    title: string;
    description?: string;
    status?: string;
    assigneeId?: string;
    dueDate?: string;
  }): Promise<TaskModel | null> {
    if (data.assigneeId) {
      const assignee = await this.assigneeDataSource.findOne(data.assigneeId);
      if (!assignee) {
        return null;
      }
    }

    const id = crypto.randomUUID();
    const task: Task = {
      id,
      title: data.title,
      description: data.description ?? null,
      status: (data.status ?? TaskStatus.PENDING) as TaskStatus,
      assigneeId: data.assigneeId ?? null,
      assignee: undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, task);
    return this.toModel(task);
  }

  async update(
    id: string,
    data: Partial<TaskModel>,
  ): Promise<TaskModel | null> {
    const task = this.tasks.get(id);
    if (!task) return null;

    if (data.assigneeId !== undefined && data.assigneeId !== null) {
      const assignee = await this.assigneeDataSource.findOne(data.assigneeId);
      if (!assignee) {
        return null;
      }
    }

    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.status !== undefined) task.status = data.status as TaskStatus;
    if (data.assigneeId !== undefined) task.assigneeId = data.assigneeId;
    if (data.dueDate !== undefined) {
      task.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    task.updatedAt = new Date();
    this.tasks.set(id, task);
    return this.toModel(task);
  }

  async remove(id: string): Promise<boolean | null> {
    const exists = this.tasks.has(id);
    if (!exists) return null;
    this.tasks.delete(id);
    return true;
  }
}
