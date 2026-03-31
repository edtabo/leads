import { IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  limit?: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  search?: string;
}