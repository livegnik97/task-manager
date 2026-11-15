import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TaskDataSourceInterface } from './datasource/task-datasource.interface';
import { TaskModel } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksPaginationDto } from '../../common/pagination-dtos/customs/tasks-pagination.dto';
import { PaginationModel } from '../../common/models/pagination.model';

const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE'];

@Injectable()
export class TasksService {
  constructor(
    private readonly taskDataSource: TaskDataSourceInterface,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskModel> {
    if (!createTaskDto.title || !createTaskDto.title.trim()) {
      throw new BadRequestException('El título es requerido');
    }

    if (
      createTaskDto.status !== undefined &&
      !VALID_STATUSES.includes(createTaskDto.status)
    ) {
      throw new BadRequestException(
        `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`,
      );
    }

    const created = await this.taskDataSource.create({
      title: createTaskDto.title.trim(),
      description: createTaskDto.description,
      status: createTaskDto.status,
      assignee: createTaskDto.assignee,
      dueDate: createTaskDto.dueDate,
    });

    if (!created) {
      throw new BadRequestException('Error creando la tarea');
    }

    return created;
  }

  async findAll(query: TasksPaginationDto): Promise<PaginationModel<TaskModel>> {
    if (query.page !== undefined && isNaN(Number(query.page))) {
      throw new BadRequestException('El parámetro page debe ser un número');
    }
    if (query.limit !== undefined && isNaN(Number(query.limit))) {
      throw new BadRequestException('El parámetro limit debe ser un número');
    }

    return this.taskDataSource.findAll(query);
  }

  async findOne(id: string): Promise<TaskModel> {
    const task = await this.taskDataSource.findOne(id);
    if (!task) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskModel> {
    if (
      updateTaskDto.status !== undefined &&
      !VALID_STATUSES.includes(updateTaskDto.status)
    ) {
      throw new BadRequestException(
        `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`,
      );
    }

    const updated = await this.taskDataSource.update(id, {
      title: updateTaskDto.title,
      description: updateTaskDto.description,
      status: updateTaskDto.status,
      assignee: updateTaskDto.assignee,
      dueDate: updateTaskDto.dueDate,
    } as Partial<TaskModel>);

    if (!updated) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.taskDataSource.remove(id);
    if (!removed) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }
  }
}
