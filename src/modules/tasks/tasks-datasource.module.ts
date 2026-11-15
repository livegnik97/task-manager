import { Module } from '@nestjs/common';
import { TaskDataSourceLocal } from './datasource/task-datasource.local';
import { TaskDataSourceInterface } from './datasource/task-datasource.interface';
import { TaskDataSource } from './tasks.datasource';
import { AssigneeDataSourceInterface } from '../assignees/datasource/assignee-datasource.interface';
import { AssigneesDataSourceModule } from '../assignees/assignee-datasource.module';

@Module({
  imports: [AssigneesDataSourceModule],
  providers: [
    {
      provide: TaskDataSourceInterface,
      useFactory: (assigneeDs: AssigneeDataSourceInterface) =>
        process.env.USE_DB === 'true'
          ? new TaskDataSource()
          : new TaskDataSourceLocal(assigneeDs),
      inject: [AssigneeDataSourceInterface],
    },
  ],
  exports: [TaskDataSourceInterface, AssigneesDataSourceModule],
})
export class TasksDataSourceModule {}
