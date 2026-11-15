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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AssigneeModel } from './models/assignee.model';
import { ApiPaginatedResponse } from '../../common/models/pagination.model';

@ApiTags('assignees')
@Controller('assignees')
export class AssigneeController {
  constructor(private readonly assigneeService: AssigneeService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo responsable' })
  @ApiBody({ type: CreateAssigneeDto })
  @ApiResponse({ status: 201, description: 'Responsable creado', type: AssigneeModel })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  async create(@Res() res: Response, @Body() createAssigneeDto: CreateAssigneeDto) {
    await CustomResponse.handleResponse(res, async () => {
      const created = await this.assigneeService.create(createAssigneeDto);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        201,
        undefined,
        undefined,
        created,
      );
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar responsables con paginación' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(AssigneeModel)
  async findAll(@Res() res: Response, @Query() query: AssigneesPaginationDto) {
    await CustomResponse.handleResponse(res, async () => {
      const result = await this.assigneeService.findAll(query);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        200,
        undefined,
        undefined,
        result,
      );
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver un responsable por ID' })
  @ApiResponse({ status: 200, description: 'Responsable encontrado', type: AssigneeModel })
  @ApiResponse({ status: 404, description: 'Responsable no encontrado' })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    await CustomResponse.handleResponse(res, async () => {
      const assignee = await this.assigneeService.findOne(id);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        200,
        undefined,
        undefined,
        assignee,
      );
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar un responsable parcialmente' })
  @ApiBody({ type: UpdateAssigneeDto })
  @ApiResponse({ status: 200, description: 'Responsable actualizado', type: AssigneeModel })
  @ApiResponse({ status: 404, description: 'Responsable no encontrado' })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  async update(@Res() res: Response, @Param('id') id: string, @Body() updateAssigneeDto: UpdateAssigneeDto) {
    await CustomResponse.handleResponse(res, async () => {
      const updated = await this.assigneeService.update(id, updateAssigneeDto);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        200,
        undefined,
        undefined,
        updated,
      );
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrar un responsable' })
  @ApiResponse({ status: 204, description: 'Responsable borrado' })
  @ApiResponse({ status: 404, description: 'Responsable no encontrado' })
  async remove(@Res() res: Response, @Param('id') id: string) {
    await CustomResponse.handleResponse(res, async () => {
      await this.assigneeService.remove(id);
      return new (require('../../common/custom-response/entities/success-response').SuccessResponse)(
        204,
      );
    });
  }
}
