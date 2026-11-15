import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { TasksModule } from './modules/tasks/tasks.module';
import { AssigneesModule } from './modules/assignees/assignee.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ...(process.env.USE_DB === 'true' ? [TypeOrmModule.forRoot(dataSourceOptions)] : []),
    TasksModule,
    AssigneesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
