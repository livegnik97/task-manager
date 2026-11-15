import { Assignee } from '../entities/assignee.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AssigneeModel {
  constructor(
    id: string,
    name: string,
    email?: string | null,
    createdAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  email?: string | null;

  @ApiProperty()
  createdAt?: Date;

  static fromEntity(entity: Assignee): AssigneeModel {
    return new AssigneeModel(
      entity.id,
      entity.name,
      entity.email,
      entity.createdAt,
    );
  }
}
