import { AssigneeModel } from '../models/assignee.model';
import { AssigneesPaginationDto } from '../../../common/pagination-dtos/customs/assignees-pagination.dto';
import { PaginationModel } from '../../../common/models/pagination.model';

export abstract class AssigneeDataSourceInterface {
  abstract findAll(query: AssigneesPaginationDto): Promise<PaginationModel<AssigneeModel>>;
  abstract findOne(id: string): Promise<AssigneeModel | null>;
  abstract create(data: {
    name: string;
    email?: string;
  }): Promise<AssigneeModel | null>;
  abstract update(
    id: string,
    data: Partial<AssigneeModel>,
  ): Promise<AssigneeModel | null>;
  abstract remove(id: string): Promise<boolean | null>;
}
