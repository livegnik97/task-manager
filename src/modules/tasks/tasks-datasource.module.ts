import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskDataSourceLocal } from './datasource/task-datasource.local';
import { TaskDataSourceInterface } from './datasource/task-datasource.interface';
import { TaskDataSource } from './tasks.datasource';
import { AssigneeDataSourceInterface } from '../assignees/datasource/assignee-datasource.interface';
import { AssigneesDataSourceModule } from '../assignees/assignee-datasource.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AssigneesDataSourceModule],
  providers: [
    {
      provide: TaskDataSourceInterface,
      useFactory: (assigneeDs: AssigneeDataSourceInterface) =>
        process.env.USE_DB === 'true'
          ? TaskDataSource
          : new TaskDataSourceLocal(assigneeDs),
      inject: [AssigneeDataSourceInterface],
    },
  ],
  exports: [TaskDataSourceInterface],
})
export class TasksDataSourceModule {}
