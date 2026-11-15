import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationWithSearchDto } from '../pagination-with-search.dto';

export class AssigneesPaginationDto extends PaginationWithSearchDto {}
