import { Injectable } from '@nestjs/common';
import { TaskDataSourceInterface } from './datasource/task-datasource.interface';
import { AssigneeDataSourceInterface } from '../assignees/datasource/assignee-datasource.interface';
import { TaskModel } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksPaginationDto } from '../../common/pagination-dtos/customs/tasks-pagination.dto';
import { PaginationModel } from '../../common/models/pagination.model';
import { MyResponse } from '../../common/custom-response/entities/my-response';
import { SuccessResponse } from '../../common/custom-response/entities/success-response';
import { ErrorResponse } from '../../common/custom-response/entities/error-response';
import { CustomResponseType } from '../../common/custom-response/custom-response-type';

const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE'];

@Injectable()
export class TasksService {
  constructor(
    private readonly taskDataSource: TaskDataSourceInterface,
    private readonly assigneeDataSource: AssigneeDataSourceInterface,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<MyResponse<TaskModel>> {
    if (!createTaskDto.title || !createTaskDto.title.trim()) {
      return new ErrorResponse(
        400,
        CustomResponseType.empty_fields,
        'El título es requerido',
      );
    }

    if (
      createTaskDto.status !== undefined &&
      !VALID_STATUSES.includes(createTaskDto.status)
    ) {
      return new ErrorResponse(
        400,
        CustomResponseType.invalid_field,
        `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`,
      );
    }

    // Validar que el assignee exista si se proporciona assigneeId
    if (createTaskDto.assigneeId) {
      const assignee = await this.assigneeDataSource.findOne(
        createTaskDto.assigneeId,
      );
      if (!assignee) {
        return new ErrorResponse(
          400,
          CustomResponseType.invalid_field,
          `El responsable con id ${createTaskDto.assigneeId} no existe`,
        );
      }
    }

    const created = await this.taskDataSource.create({
      title: createTaskDto.title.trim(),
      description: createTaskDto.description,
      status: createTaskDto.status,
      assigneeId: createTaskDto.assigneeId,
      dueDate: createTaskDto.dueDate,
    });

    if (!created) {
      return new ErrorResponse(
        400,
        CustomResponseType.create_error,
        'Error creando la tarea',
      );
    }

    return new SuccessResponse(201, undefined, undefined, created);
  }

  async findAll(
    query: TasksPaginationDto,
  ): Promise<MyResponse<PaginationModel<TaskModel>>> {
    if (query.page !== undefined && isNaN(Number(query.page))) {
      return new ErrorResponse(
        400,
        CustomResponseType.invalid_field,
        'El parámetro page debe ser un número',
      );
    }
    if (query.limit !== undefined && isNaN(Number(query.limit))) {
      return new ErrorResponse(
        400,
        CustomResponseType.invalid_field,
        'El parámetro limit debe ser un número',
      );
    }

    const result = await this.taskDataSource.findAll(query);
    return new SuccessResponse(200, undefined, undefined, result);
  }

  async findOne(id: string): Promise<MyResponse<TaskModel>> {
    const task = await this.taskDataSource.findOne(id);
    if (!task) {
      return new ErrorResponse(
        404,
        CustomResponseType.not_found,
        `Tarea con id ${id} no encontrada`,
      );
    }
    return new SuccessResponse(200, undefined, undefined, task);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<MyResponse<TaskModel>> {
    if (
      updateTaskDto.status !== undefined &&
      !VALID_STATUSES.includes(updateTaskDto.status)
    ) {
      return new ErrorResponse(
        400,
        CustomResponseType.invalid_field,
        `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`,
      );
    }

    // Validar que el assignee exista si se proporciona assigneeId
    if (
      updateTaskDto.assigneeId !== undefined &&
      updateTaskDto.assigneeId !== null
    ) {
      const assignee = await this.assigneeDataSource.findOne(
        updateTaskDto.assigneeId,
      );
      if (!assignee) {
        return new ErrorResponse(
          400,
          CustomResponseType.invalid_field,
          `El responsable con id ${updateTaskDto.assigneeId} no existe`,
        );
      }
    }

    const updated = await this.taskDataSource.update(id, {
      title: updateTaskDto.title,
      description: updateTaskDto.description,
      status: updateTaskDto.status,
      assigneeId: updateTaskDto.assigneeId,
      dueDate: updateTaskDto.dueDate,
    } as Partial<TaskModel>);

    if (!updated) {
      return new ErrorResponse(
        404,
        CustomResponseType.not_found,
        `Tarea con id ${id} no encontrada`,
      );
    }

    return new SuccessResponse(200, undefined, undefined, updated);
  }

  async remove(id: string): Promise<MyResponse<void>> {
    const removed = await this.taskDataSource.remove(id);
    if (!removed) {
      return new ErrorResponse(
        404,
        CustomResponseType.not_found,
        `Tarea con id ${id} no encontrada`,
      );
    }
    return new SuccessResponse(204);
  }
}
