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
import { AssigneeService } from './assignee.service';
import { CreateAssigneeDto } from './dto/create-assignee.dto';
import { UpdateAssigneeDto } from './dto/update-assignee.dto';
import { AssigneesPaginationDto } from '../../common/pagination-dtos/customs/assignees-pagination.dto';
import { CustomResponse } from '../../common/custom-response/custom-response';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AssigneeModel } from './models/assignee.model';
import { ApiPaginatedResponse } from '../../common/models/pagination.model';

@ApiTags('assignees')
@Controller('assignees')
export class AssigneeController {
  constructor(private readonly assigneeService: AssigneeService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo responsable' })
  @ApiBody({ type: CreateAssigneeDto })
  @ApiResponse({
    status: 201,
    description: 'Responsable creado',
    type: AssigneeModel,
  })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  async create(
    @Res() res: Response,
    @Body() createAssigneeDto: CreateAssigneeDto,
  ) {
    await CustomResponse.handleResponse(res, () =>
      this.assigneeService.create(createAssigneeDto),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar responsables con paginación' })
  @ApiPaginatedResponse(AssigneeModel)
  async findAll(@Res() res: Response, @Query() query: AssigneesPaginationDto) {
    await CustomResponse.handleResponse(res, () =>
      this.assigneeService.findAll(query),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver un responsable por ID' })
  @ApiResponse({
    status: 200,
    description: 'Responsable encontrado',
    type: AssigneeModel,
  })
  @ApiResponse({ status: 404, description: 'Responsable no encontrado' })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    await CustomResponse.handleResponse(res, () =>
      this.assigneeService.findOne(id),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar un responsable parcialmente' })
  @ApiBody({ type: UpdateAssigneeDto })
  @ApiResponse({
    status: 200,
    description: 'Responsable actualizado',
    type: AssigneeModel,
  })
  @ApiResponse({ status: 404, description: 'Responsable no encontrado' })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateAssigneeDto: UpdateAssigneeDto,
  ) {
    await CustomResponse.handleResponse(res, () =>
      this.assigneeService.update(id, updateAssigneeDto),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrar un responsable' })
  @ApiResponse({ status: 204, description: 'Responsable borrado' })
  @ApiResponse({ status: 404, description: 'Responsable no encontrado' })
  async remove(@Res() res: Response, @Param('id') id: string) {
    await CustomResponse.handleResponse(res, () =>
      this.assigneeService.remove(id),
    );
  }
}
