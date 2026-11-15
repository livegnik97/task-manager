import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignee } from './entities/assignee.entity';
import { AssigneeDataSourceLocal } from './datasource/assignee-datasource.local';
import { AssigneeDataSourceInterface } from './datasource/assignee-datasource.interface';
import { AssigneeDataSource } from './assignee.datasource';

@Module({
  imports: [TypeOrmModule.forFeature([Assignee])],
  providers: [
    {
      provide: AssigneeDataSourceInterface,
      useFactory: () =>
        process.env.USE_DB === 'true'
          ? new AssigneeDataSource()
          : new AssigneeDataSourceLocal(),
    },
  ],
  exports: [AssigneeDataSourceInterface],
})
export class AssigneesDataSourceModule {}
