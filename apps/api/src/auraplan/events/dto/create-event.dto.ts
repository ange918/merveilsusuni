import { IsDateString, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date_evenement: string;

  @IsOptional()
  @IsString()
  lieu?: string;
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date_evenement?: string;

  @IsOptional()
  @IsString()
  lieu?: string;

  @IsOptional()
  @IsIn(['actif', 'termine', 'annule'])
  statut?: string;
}
