import { IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  limit?: number;

  @IsOptional()
  page?: number;
}