import { Injectable, Inject, OnModuleInit, Optional } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Assignee } from './entities/assignee.entity';
import { AssigneeModel } from './models/assignee.model';
import { AssigneesPaginationDto } from '../../common/pagination-dtos/customs/assignees-pagination.dto';
import { PaginationModel } from '../../common/models/pagination.model';
import { AssigneeDataSourceInterface } from './datasource/assignee-datasource.interface';

@Injectable()
export class AssigneeDataSource extends AssigneeDataSourceInterface implements OnModuleInit {
  private assigneeRepository!: Repository<Assignee>;

  constructor(
    @Optional() @Inject(DataSource) private readonly dataSource?: DataSource,
  ) {
    super();
  }

  onModuleInit() {
    if (this.dataSource) {
      this.assigneeRepository = this.dataSource.getRepository(Assignee);
    }
  }

  async findAll(query: AssigneesPaginationDto): Promise<PaginationModel<AssigneeModel>> {
    const qb = this.assigneeRepository.createQueryBuilder('assignee');

    if (query.search) {
      qb.andWhere(
        '(assignee.name ILIKE :search OR assignee.email ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const skip = (page - 1) * limit;
    qb.orderBy('assignee.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return PaginationModel.build({
      page,
      limit,
      total,
      data: data.map((a) => AssigneeModel.fromEntity(a)),
    });
  }

  async findOne(id: string): Promise<AssigneeModel | null> {
    const assignee = await this.assigneeRepository.findOne({ where: { id } });
    if (!assignee) return null;
    return AssigneeModel.fromEntity(assignee);
  }

  async create(data: {
    name: string;
    email?: string;
  }): Promise<AssigneeModel | null> {
    const assignee = this.assigneeRepository.create({
      name: data.name,
      email: data.email,
    });
    const saved = await this.assigneeRepository.save(assignee);
    return AssigneeModel.fromEntity(saved);
  }

  async update(
    id: string,
    data: Partial<AssigneeModel>,
  ): Promise<AssigneeModel | null> {
    const assignee = await this.assigneeRepository.findOne({ where: { id } });
    if (!assignee) return null;

    if (data.name !== undefined) assignee.name = data.name;
    if (data.email !== undefined) assignee.email = data.email;

    const saved = await this.assigneeRepository.save(assignee);
    return AssigneeModel.fromEntity(saved);
  }

  async remove(id: string): Promise<boolean | null> {
    const result = await this.assigneeRepository.delete({ id });
    if (result.affected === 0) return null;
    return true;
  }
}
