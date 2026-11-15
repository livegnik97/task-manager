import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

export class PaginationModel<T> {
  private constructor(
    page: number,
    totalPages: number,
    limit: number,
    total: number,
    data: T[],
  ) {
    this.page = page;
    this.totalPages = totalPages;
    this.limit = limit;
    this.total = total;
    this.data = data;
  }

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: Object, isArray: true })
  data: T[];

  static build<T>(payload: {
    page: number;
    limit: number;
    total: number;
    data: T[];
  }): PaginationModel<T> {
    const limit = payload.limit > 0 ? payload.limit : 10;
    const totalPages = payload.total > 0 ? Math.ceil(payload.total / limit) : 1;
    return new PaginationModel<T>(
      payload.page > 0 ? payload.page : 1,
      totalPages,
      limit,
      payload.total,
      payload.data,
    );
  }

  static empty<T>(): PaginationModel<T> {
    return PaginationModel.build<T>({
      page: 1,
      limit: 10,
      total: 0,
      data: [],
    });
  }
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginationModel, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationModel) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
