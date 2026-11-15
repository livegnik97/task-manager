import { Injectable, Inject } from '@nestjs/common';

export const Entity = (options?: any) => (_target: any) => {};
export const Column = (options?: any) => (_target: any, _key: string) => {};
export const PrimaryGeneratedColumn = (strategy?: any) => (_target: any, _key: string) => {};
export const CreateDateColumn = (options?: any) => (_target: any, _key: string) => {};
export const UpdateDateColumn = (options?: any) => (_target: any, _key: string) => {};
export const ManyToOne = (target?: any, options?: any) => (_target: any, _key: string) => {};
export const JoinColumn = (options?: any) => (_target: any, _key: string) => {};

class TypeOrmCoreModule {}

export const InjectRepository = (entity: any) => {
  return Inject(entity);
};

export class Repository<T> {
  constructor(public entity: any) {}
  async createQueryBuilder(): Promise<any> {
    return {
      andWhere: () => this,
      orderBy: () => this,
      skip: () => this,
      take: () => this,
      getManyAndCount: async () => [[], 0],
    };
  }
  async findOne(options: any) {
    return null;
  }
  async create(data: any) {
    return data;
  }
  async save(data: any) {
    return { ...data, id: 'mock-id', createdAt: new Date(), updatedAt: new Date() };
  }
  async delete(options: any) {
    return { affected: 1 };
  }
}

export class DataSource {
  constructor(public options: any) {}
  async initialize() {}
  async destroy() {}
}

export const TypeOrmModule = {
  forRoot: () => ({ module: TypeOrmCoreModule }),
  forFeature: (entities: any[]) => ({
    module: TypeOrmCoreModule,
    providers: entities.map((e) => ({
      provide: e,
      useClass: Repository,
    })),
    exports: entities.map((e) => ({ provide: e, useClass: Repository })),
  }),
};
