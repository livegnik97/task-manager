import { Module } from '@nestjs/common';
import { TaskDataSourceLocal } from './datasource/task-datasource.local';
import { TaskDataSourceInterface } from './datasource/task-datasource.interface';

@Module({
  providers: [
    {
      provide: TaskDataSourceInterface,
      useClass: TaskDataSourceLocal,
    },
  ],
  exports: [TaskDataSourceInterface],
})
export class TasksDataSourceModule {}
