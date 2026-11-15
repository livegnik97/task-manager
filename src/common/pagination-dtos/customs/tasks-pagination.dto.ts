import { IsOptional, IsString, IsEnum } from 'class-validator';
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
  @IsString()
  assignee?: string;
}
