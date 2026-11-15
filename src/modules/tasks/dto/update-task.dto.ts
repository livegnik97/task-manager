import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  assignee?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
