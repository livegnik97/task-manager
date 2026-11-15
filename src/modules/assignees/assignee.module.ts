import { Module } from '@nestjs/common';
import { AssigneeService } from './assignee.service';
import { AssigneeController } from './assignee.controller';
import { AssigneeDataSourceInterface } from './datasource/assignee-datasource.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignee } from './entities/assignee.entity';
import { AssigneeDataSource } from './assignee.datasource';
import { AssigneeDataSourceLocal } from './datasource/assignee-datasource.local';

@Module({
  imports: [
    ...(process.env.USE_DB === 'true'
      ? [TypeOrmModule.forFeature([Assignee])]
      : []),
  ],
  providers: [
    AssigneeService,
    {
      provide: AssigneeDataSourceInterface,
      useClass:
        process.env.USE_DB === 'true'
          ? AssigneeDataSource
          : AssigneeDataSourceLocal,
    },
  ],
  controllers: [AssigneeController],
  exports: [AssigneeService, AssigneeDataSourceInterface],
})
export class AssigneesModule {}
