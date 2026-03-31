import { IsOptional, IsString } from 'class-validator';

export class GetAISummaryDto {
  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}