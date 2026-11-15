import {
  IsString,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class UpdateAssigneeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
