import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AssigneeDataSourceInterface } from './datasource/assignee-datasource.interface';
import { AssigneeModel } from './models/assignee.model';
import { CreateAssigneeDto } from './dto/create-assignee.dto';
import { UpdateAssigneeDto } from './dto/update-assignee.dto';
import { AssigneesPaginationDto } from '../../common/pagination-dtos/customs/assignees-pagination.dto';
import { PaginationModel } from '../../common/models/pagination.model';

@Injectable()
export class AssigneeService {
  constructor(
    private readonly assigneeDataSource: AssigneeDataSourceInterface,
  ) {}

  async create(createAssigneeDto: CreateAssigneeDto): Promise<AssigneeModel> {
    if (!createAssigneeDto.name || !createAssigneeDto.name.trim()) {
      throw new BadRequestException('El nombre es requerido');
    }

    const created = await this.assigneeDataSource.create({
      name: createAssigneeDto.name.trim(),
      email: createAssigneeDto.email,
    });

    if (!created) {
      throw new BadRequestException('Error creando el responsable');
    }

    return created;
  }

  async findAll(query: AssigneesPaginationDto): Promise<PaginationModel<AssigneeModel>> {
    if (query.page !== undefined && isNaN(Number(query.page))) {
      throw new BadRequestException('El parámetro page debe ser un número');
    }
    if (query.limit !== undefined && isNaN(Number(query.limit))) {
      throw new BadRequestException('El parámetro limit debe ser un número');
    }

    return this.assigneeDataSource.findAll(query);
  }

  async findOne(id: string): Promise<AssigneeModel> {
    const assignee = await this.assigneeDataSource.findOne(id);
    if (!assignee) {
      throw new NotFoundException(`Responsable con id ${id} no encontrado`);
    }
    return assignee;
  }

  async update(id: string, updateAssigneeDto: UpdateAssigneeDto): Promise<AssigneeModel> {
    const updated = await this.assigneeDataSource.update(id, {
      name: updateAssigneeDto.name,
      email: updateAssigneeDto.email,
    } as Partial<AssigneeModel>);

    if (!updated) {
      throw new NotFoundException(`Responsable con id ${id} no encontrado`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.assigneeDataSource.remove(id);
    if (!removed) {
      throw new NotFoundException(`Responsable con id ${id} no encontrado`);
    }
  }
}
