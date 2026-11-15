import { Module } from '@nestjs/common';
import { AssigneeDataSourceLocal } from './datasource/assignee-datasource.local';
import { AssigneeDataSourceInterface } from './datasource/assignee-datasource.interface';

@Module({
  providers: [
    {
      provide: AssigneeDataSourceInterface,
      useClass: AssigneeDataSourceLocal,
    },
  ],
  exports: [AssigneeDataSourceInterface],
})
export class AssigneesDataSourceModule {}
