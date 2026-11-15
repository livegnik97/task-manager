import { Module } from '@nestjs/common';
import { TaskDataSourceLocal } from './datasource/task-datasource.local';
import { TaskDataSourceInterface } from './datasource/task-datasource.interface';
import { TaskDataSource } from './tasks.datasource';

@Module({
  providers: [
    {
      provide: TaskDataSourceInterface,
      useClass: process.env.USE_DB === 'true'
        ? TaskDataSource
        : TaskDataSourceLocal,
    },
  ],
  exports: [TaskDataSourceInterface],
})
export class TasksDataSourceModule {}
