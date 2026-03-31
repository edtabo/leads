import { IsNumber } from 'class-validator';

export class DeleteDto {
  @IsNumber()
  id: bigint;
}
