import { Module } from '@nestjs/common';
import { AssigneeService } from './assignee.service';
import { AssigneeController } from './assignee.controller';
import { AssigneesDataSourceModule } from './assignee-datasource.module';

@Module({
  imports: [AssigneesDataSourceModule],
  providers: [AssigneeService],
  controllers: [AssigneeController],
  exports: [AssigneeService],
})
export class AssigneesModule {}
