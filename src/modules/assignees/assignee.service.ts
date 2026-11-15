import { Injectable } from '@nestjs/common';
import { AssigneeDataSourceInterface } from './datasource/assignee-datasource.interface';
import { AssigneeModel } from './models/assignee.model';
import { CreateAssigneeDto } from './dto/create-assignee.dto';
import { UpdateAssigneeDto } from './dto/update-assignee.dto';
import { AssigneesPaginationDto } from '../../common/pagination-dtos/customs/assignees-pagination.dto';
import { PaginationModel } from '../../common/models/pagination.model';
import { MyResponse } from '../../common/custom-response/entities/my-response';
import { SuccessResponse } from '../../common/custom-response/entities/success-response';
import { ErrorResponse } from '../../common/custom-response/entities/error-response';
import { CustomResponseType } from '../../common/custom-response/custom-response-type';

@Injectable()
export class AssigneeService {
  constructor(
    private readonly assigneeDataSource: AssigneeDataSourceInterface,
  ) {}

  async create(
    createAssigneeDto: CreateAssigneeDto,
  ): Promise<MyResponse<AssigneeModel>> {
    if (!createAssigneeDto.name || !createAssigneeDto.name.trim()) {
      return new ErrorResponse(
        400,
        CustomResponseType.empty_fields,
        'El nombre es requerido',
      );
    }

    const created = await this.assigneeDataSource.create({
      name: createAssigneeDto.name.trim(),
      email: createAssigneeDto.email,
    });

    if (!created) {
      return new ErrorResponse(
        400,
        CustomResponseType.create_error,
        'Error creando el responsable',
      );
    }

    return new SuccessResponse(201, undefined, undefined, created);
  }

  async findAll(
    query: AssigneesPaginationDto,
  ): Promise<MyResponse<PaginationModel<AssigneeModel>>> {
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

    const result = await this.assigneeDataSource.findAll(query);
    return new SuccessResponse(200, undefined, undefined, result);
  }

  async findOne(id: string): Promise<MyResponse<AssigneeModel>> {
    const assignee = await this.assigneeDataSource.findOne(id);
    if (!assignee) {
      return new ErrorResponse(
        404,
        CustomResponseType.not_found,
        `Responsable con id ${id} no encontrado`,
      );
    }
    return new SuccessResponse(200, undefined, undefined, assignee);
  }

  async update(
    id: string,
    updateAssigneeDto: UpdateAssigneeDto,
  ): Promise<MyResponse<AssigneeModel>> {
    const updated = await this.assigneeDataSource.update(id, {
      name: updateAssigneeDto.name,
      email: updateAssigneeDto.email,
    });

    if (!updated) {
      return new ErrorResponse(
        404,
        CustomResponseType.not_found,
        `Responsable con id ${id} no encontrado`,
      );
    }

    return new SuccessResponse(200, undefined, undefined, updated);
  }

  async remove(id: string): Promise<MyResponse<void>> {
    const removed = await this.assigneeDataSource.remove(id);
    if (!removed) {
      return new ErrorResponse(
        404,
        CustomResponseType.not_found,
        `Responsable con id ${id} no encontrado`,
      );
    }
    return new SuccessResponse(204);
  }
}
