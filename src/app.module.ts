import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { TasksModule } from './modules/tasks/tasks.module';
import { AssigneesModule } from './modules/assignees/assignee.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        if (config.get<string>('USE_DB') === 'true') {
          return {
            ...dataSourceOptions,
            autoLoadEntities: true,
          };
        }
        // Configuración vacía cuando USE_DB=false (modo local con Map en memoria)
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'root',
          password: 'postgres',
          database: 'task_manager_db',
          entities: [],
          migrations: [],
          synchronize: false,
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    TasksModule,
    AssigneesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
