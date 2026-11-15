import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../pagination.dto';

export enum TaskStatusFilter {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class TasksPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ enum: TaskStatusFilter })
  @IsOptional()
  @IsEnum(TaskStatusFilter)
  status?: TaskStatusFilter;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
