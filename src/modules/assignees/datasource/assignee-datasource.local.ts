import { Injectable } from '@nestjs/common';
import { AssigneeDataSourceInterface } from './assignee-datasource.interface';
import { AssigneeModel } from '../models/assignee.model';
import { Assignee } from '../entities/assignee.entity';
import { AssigneesPaginationDto } from '../../../common/pagination-dtos/customs/assignees-pagination.dto';
import { PaginationModel } from '../../../common/models/pagination.model';

@Injectable()
export class AssigneeDataSourceLocal extends AssigneeDataSourceInterface {
  private readonly assignees = new Map<string, Assignee>();

  async findAll(query: AssigneesPaginationDto): Promise<PaginationModel<AssigneeModel>> {
    let items = Array.from(this.assignees.values());

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      items = items.filter(
        (a) => a.name.toLowerCase().includes(searchLower) ||
               (a.email ?? '').toLowerCase().includes(searchLower),
      );
    }

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const skip = (page - 1) * limit;
    const total = items.length;
    const pagedItems = items.slice(skip, skip + limit).map((a) =>
      AssigneeModel.fromEntity(a),
    );

    return PaginationModel.build({
      page,
      limit,
      total,
      data: pagedItems,
    });
  }

  async findOne(id: string): Promise<AssigneeModel | null> {
    const assignee = this.assignees.get(id);
    if (!assignee) return null;
    return AssigneeModel.fromEntity(assignee);
  }

  async create(data: {
    name: string;
    email?: string;
  }): Promise<AssigneeModel | null> {
    const id = crypto.randomUUID();
    const assignee: Assignee = {
      id,
      name: data.name,
      email: data.email ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assignees.set(id, assignee);
    return AssigneeModel.fromEntity(assignee);
  }

  async update(
    id: string,
    data: Partial<AssigneeModel>,
  ): Promise<AssigneeModel | null> {
    const assignee = this.assignees.get(id);
    if (!assignee) return null;

    if (data.name !== undefined) assignee.name = data.name;
    if (data.email !== undefined) assignee.email = data.email;
    assignee.updatedAt = new Date();
    this.assignees.set(id, assignee);
    return AssigneeModel.fromEntity(assignee);
  }

  async remove(id: string): Promise<boolean | null> {
    const exists = this.assignees.has(id);
    if (!exists) return null;
    this.assignees.delete(id);
    return true;
  }
}
