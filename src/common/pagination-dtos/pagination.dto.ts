import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsPositive, Min } from 'class-validator';

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

  generateRedisKey(): string {
    return `${this.page ?? 1}-${this.limit ?? 20}`;
  }
}
