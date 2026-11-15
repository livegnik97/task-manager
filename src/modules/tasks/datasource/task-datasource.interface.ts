import { TaskModel } from '../models/task.model';
import { TasksPaginationDto } from '../../../common/pagination-dtos/customs/tasks-pagination.dto';
import { PaginationModel } from '../../../common/models/pagination.model';

export abstract class TaskDataSourceInterface {
  abstract findAll(query: TasksPaginationDto): Promise<PaginationModel<TaskModel>>;
  abstract findOne(id: string): Promise<TaskModel | null>;
  abstract create(data: {
    title: string;
    description?: string;
    status?: string;
    assignee?: string;
    dueDate?: string;
  }): Promise<TaskModel | null>;
  abstract update(
    id: string,
    data: Partial<TaskModel>,
  ): Promise<TaskModel | null>;
  abstract remove(id: string): Promise<boolean | null>;
}
