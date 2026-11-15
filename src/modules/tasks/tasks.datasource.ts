import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { TaskModel } from './models/task.model';
import { TasksPaginationDto } from '../../common/pagination-dtos/customs/tasks-pagination.dto';
import { PaginationModel } from '../../common/models/pagination.model';
import { TaskDataSourceInterface } from './datasource/task-datasource.interface';
import { Assignee } from '../assignees/entities/assignee.entity';

@Injectable()
export class TaskDataSource extends TaskDataSourceInterface {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Assignee)
    private readonly assigneeRepository: Repository<Assignee>,
  ) {
    super();
  }

  async findAll(query: TasksPaginationDto): Promise<PaginationModel<TaskModel>> {
    const qb = this.taskRepository.createQueryBuilder('task');
    qb.leftJoinAndSelect('task.assignee', 'assignee');

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }

    if (query.assigneeId) {
      qb.andWhere('task.assigneeId = :assigneeId', { assigneeId: query.assigneeId });
    }

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const skip = (page - 1) * limit;
    qb.orderBy('task.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return PaginationModel.build({
      page,
      limit,
      total,
      data: data.map((t) => TaskModel.fromEntity(t)),
    });
  }

  async findOne(id: string): Promise<TaskModel | null> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { assignee: true },
    });
    if (!task) return null;
    return TaskModel.fromEntity(task);
  }

  async create(data: {
    title: string;
    description?: string;
    status?: string;
    assigneeId?: string;
    dueDate?: string;
  }): Promise<TaskModel | null> {
    // Validar que el assignee exista si se proporciona assigneeId
    if (data.assigneeId) {
      const assignee = await this.assigneeRepository.findOne({
        where: { id: data.assigneeId },
      });
      if (!assignee) {
        return null;
      }
    }

    const task = this.taskRepository.create({
      title: data.title,
      description: data.description,
      status: (data.status ?? TaskStatus.PENDING) as TaskStatus,
      assigneeId: data.assigneeId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });
    const saved = await this.taskRepository.save(task);
    return TaskModel.fromEntity(saved);
  }

  async update(
    id: string,
    data: Partial<TaskModel>,
  ): Promise<TaskModel | null> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) return null;

    // Validar assigneeId si se está actualizando
    if (data.assigneeId !== undefined && data.assigneeId !== null) {
      const assignee = await this.assigneeRepository.findOne({
        where: { id: data.assigneeId },
      });
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

    const saved = await this.taskRepository.save(task);
    return TaskModel.fromEntity(saved);
  }

  async remove(id: string): Promise<boolean | null> {
    const result = await this.taskRepository.delete({ id });
    if (result.affected === 0) return null;
    return true;
  }
}
