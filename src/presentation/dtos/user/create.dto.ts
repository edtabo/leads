import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { Source } from '../../../shared/enums';

export class CreateDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  fullName: string;

  @IsEmail({}, { message: 'El email debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

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
