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
        const useDb = config.get<string>('USE_DB') === 'true';
        if (useDb) {
          return {
            ...dataSourceOptions,
            autoLoadEntities: true,
          };
        }
        // Configuración mínima cuando USE_DB=false - DataSource debe estar registrado
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
