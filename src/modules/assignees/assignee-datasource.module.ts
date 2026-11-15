import { Module } from '@nestjs/common';
import { AssigneeDataSourceLocal } from './datasource/assignee-datasource.local';
import { AssigneeDataSourceInterface } from './datasource/assignee-datasource.interface';
import { AssigneeDataSource } from './assignee.datasource';

@Module({
  providers: [
    {
      provide: AssigneeDataSourceInterface,
      useFactory: () => {
        console.log('AssigneesDataSourceModule', process.env.USE_DB === 'true');
        return process.env.USE_DB === 'true'
          ? new AssigneeDataSource()
          : new AssigneeDataSourceLocal();
      },
    },
  ],
  exports: [AssigneeDataSourceInterface],
})
export class AssigneesDataSourceModule {}
