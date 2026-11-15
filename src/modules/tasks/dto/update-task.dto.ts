import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiPropertyOptional({ enum: TaskStatus, required: false, nullable: true })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  assignee?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: String, format: 'date-time', required: false, nullable: true })
  dueDate?: string;
}
