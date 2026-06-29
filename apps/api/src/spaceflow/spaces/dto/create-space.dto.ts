import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  capacite: number;

  @IsNumber()
  @Min(0)
  tarif_base: number;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsObject()
  options?: Record<string, number>;
}

export class UpdateSpaceDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  capacite?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tarif_base?: number;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsObject()
  options?: Record<string, number>;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
