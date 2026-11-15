import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  assigneeId?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: String, format: 'date-time', required: false })
  dueDate?: string;
}
