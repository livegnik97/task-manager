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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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
    await CustomResponse.handleResponse(res, () =>
      this.tasksService.create(createTaskDto),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar tareas con filtros y paginación' })
  @ApiPaginatedResponse(TaskModel)
  async findAll(@Res() res: Response, @Query() query: TasksPaginationDto) {
    await CustomResponse.handleResponse(res, () =>
      this.tasksService.findAll(query),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver una tarea por ID' })
  @ApiResponse({
    status: 200,
    description: 'Tarea encontrada',
    type: TaskModel,
  })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    await CustomResponse.handleResponse(res, () =>
      this.tasksService.findOne(id),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar una tarea parcialmente' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Tarea actualizada',
    type: TaskModel,
  })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    await CustomResponse.handleResponse(res, () =>
      this.tasksService.update(id, updateTaskDto),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrar una tarea' })
  @ApiResponse({ status: 204, description: 'Tarea borrada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async remove(@Res() res: Response, @Param('id') id: string) {
    await CustomResponse.handleResponse(res, () =>
      this.tasksService.remove(id),
    );
  }
}
