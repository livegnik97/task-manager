import { Module } from '@nestjs/common';
import { AssigneeDataSourceLocal } from './datasource/assignee-datasource.local';
import { AssigneeDataSourceInterface } from './datasource/assignee-datasource.interface';
import { AssigneeDataSource } from './assignee.datasource';

@Module({
  providers: [
    {
      provide: AssigneeDataSourceInterface,
      useClass: process.env.USE_DB === 'true'
        ? AssigneeDataSource
        : AssigneeDataSourceLocal,
    },
  ],
  exports: [AssigneeDataSourceInterface],
})
export class AssigneesDataSourceModule {}
