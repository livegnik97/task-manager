import { Task, TaskStatus } from '../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TaskModel {
  constructor(
    id: string,
    title: string,
    description?: string | null,
    status?: TaskStatus | null,
    assigneeId?: string | null,
    assigneeName?: string | null,
    dueDate?: Date | null,
    createdAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status ?? TaskStatus.PENDING;
    this.assigneeId = assigneeId;
    this.assigneeName = assigneeName;
    this.dueDate = dueDate;
    this.createdAt = createdAt ?? new Date();
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description?: string | null;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ nullable: true })
  assigneeId?: string | null;

  @ApiProperty({ nullable: true })
  assigneeName?: string | null;

  @ApiProperty({ nullable: true, type: Date })
  dueDate?: Date | null;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: Task): TaskModel {
    return new TaskModel(
      entity.id,
      entity.title,
      entity.description,
      entity.status,
      entity.assigneeId,
      entity.assignee?.name ?? null,
      entity.dueDate,
      entity.createdAt,
    );
  }
}
