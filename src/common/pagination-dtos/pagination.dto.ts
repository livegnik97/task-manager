import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsPositive, Min, IsString, IsEnum } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  page?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC';

  generateRedisKey(): string {
    return `${this.page ?? 1}-${this.limit ?? 20}-${this.search ?? ''}-${this.orderBy ?? ''}-${this.orderDirection ?? ''}`;
  }
}
