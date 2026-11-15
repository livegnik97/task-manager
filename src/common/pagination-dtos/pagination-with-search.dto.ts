import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export class PaginationWithSearchDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  override generateRedisKey(): string {
    return super.generateRedisKey() + '-' + (this.search ?? '');
  }
}
