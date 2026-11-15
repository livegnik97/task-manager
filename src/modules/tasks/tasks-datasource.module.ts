import { Module } from '@nestjs/common';
import { TaskDataSourceLocal } from './datasource/task-datasource.local';
import { TaskDataSourceInterface } from './datasource/task-datasource.interface';
import { AssigneesDataSourceModule } from '../assignees/assignee-datasource.module';

@Module({
  imports: [AssigneesDataSourceModule],
  providers: [
    {
      provide: TaskDataSourceInterface,
      useClass: TaskDataSourceLocal,
    },
  ],
  exports: [TaskDataSourceInterface, AssigneesDataSourceModule],
})
export class TasksDataSourceModule {}
