import { Injectable, Inject, Module } from '@nestjs/common';

export const Entity = (options?: any) => (_target: any) => {};
export const Column = (options?: any) => (_target: any, _key: string) => {};
export const PrimaryGeneratedColumn =
  (strategy?: any) => (_target: any, _key: string) => {};
export const CreateDateColumn =
  (options?: any) => (_target: any, _key: string) => {};
export const UpdateDateColumn =
  (options?: any) => (_target: any, _key: string) => {};
export const ManyToOne =
  (target?: any, options?: any) => (_target: any, _key: string) => {};
export const JoinColumn = (options?: any) => (_target: any, _key: string) => {};

export class DataSource {
  constructor(public options: any) {}
  async initialize() {}
  async destroy() {}
  getRepository<T>(entity: any): Repository<T> {
    return {
      findOne: async () => null,
      find: async () => [],
      create: (data: any) => data,
      save: async (data: any) => ({ ...data, id: 'mock-id', createdAt: new Date(), updatedAt: new Date() }),
      delete: async () => ({ affected: 1 }),
      createQueryBuilder: () => ({
        andWhere: () => this,
        orderBy: () => this,
        skip: () => this,
        take: () => this,
        getManyAndCount: async () => [[], 0],
        leftJoinAndSelect: () => this,
      }),
    } as unknown as Repository<T>;
  }
}

export class Repository<T> {}

@Module({
  providers: [{ provide: DataSource, useClass: DataSource }],
  exports: [DataSource],
})
class TypeOrmCoreModule {}

export const InjectRepository = (entity: any) => {
  return Inject(entity);
};

export const TypeOrmModule = {
  forRoot: () => TypeOrmCoreModule,
  forRootAsync: () => TypeOrmCoreModule,
  forFeature: () => TypeOrmCoreModule,
};
