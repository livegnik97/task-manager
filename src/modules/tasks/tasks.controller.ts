import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksPaginationDto } from '../../common/pagination-dtos/customs/tasks-pagination.dto';
import { CustomResponse } from '../../common/custom-response/custom-response';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { TaskModel } from './models/task.model';
import { ApiPaginatedResponse } from '../../common/models/pagination.model';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Tarea creada', type: TaskModel })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  async create(@Res() res: Response, @Body() createTaskDto: CreateTaskDto) {
    await CustomResponse.handleResponse(res, async () => {
      const created = await this.tasksService.create(createTaskDto);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        201,
        undefined,
        undefined,
        created,
      );
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar tareas con filtros y paginación' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'IN_PROGRESS', 'DONE'] })
  @ApiQuery({ name: 'assignee', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(TaskModel)
  async findAll(@Res() res: Response, @Query() query: TasksPaginationDto) {
    await CustomResponse.handleResponse(res, async () => {
      const result = await this.tasksService.findAll(query);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        200,
        undefined,
        undefined,
        result,
      );
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver una tarea por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada', type: TaskModel })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    await CustomResponse.handleResponse(res, async () => {
      const task = await this.tasksService.findOne(id);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        200,
        undefined,
        undefined,
        task,
      );
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar una tarea parcialmente' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Tarea actualizada', type: TaskModel })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  async update(@Res() res: Response, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    await CustomResponse.handleResponse(res, async () => {
      const updated = await this.tasksService.update(id, updateTaskDto);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        200,
        undefined,
        undefined,
        updated,
      );
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrar una tarea' })
  @ApiResponse({ status: 204, description: 'Tarea borrada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async remove(@Res() res: Response, @Param('id') id: string) {
    await CustomResponse.handleResponse(res, async () => {
      await this.tasksService.remove(id);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        204,
      );
    });
  }
}
