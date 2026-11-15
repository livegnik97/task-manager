import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateAssigneeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
