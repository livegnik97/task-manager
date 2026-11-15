import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskDataSourceInterface } from './datasource/task-datasource.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskDataSource } from './tasks.datasource';
import { TaskDataSourceLocal } from './datasource/task-datasource.local';
import { AssigneesModule } from '../assignees/assignee.module';

@Module({
  imports: [
    ...(process.env.USE_DB === 'true'
      ? [TypeOrmModule.forFeature([Task])]
      : []),
    AssigneesModule,
  ],
  providers: [
    TasksService,
    {
      provide: TaskDataSourceInterface,
      useClass:
        process.env.USE_DB === 'true' ? TaskDataSource : TaskDataSourceLocal,
    },
  ],
  controllers: [TasksController],
  exports: [TasksService, TaskDataSourceInterface],
})
export class TasksModule {}
