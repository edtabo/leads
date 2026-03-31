import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { Source } from '@/shared/enums';

export class UpdateDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(Source, { message: `La fuente debe ser una de las siguientes: ${Object.values(Source).join(', ')}` })
  @IsNotEmpty({ message: 'La fuente es requerida' })
  source: Source;

  @IsOptional()
  @IsString()
  productOfInterest?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El presupuesto debe ser un número' })
  budget?: number;
}
