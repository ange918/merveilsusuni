import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTaskDto {
  @IsUUID()
  evenement_id: string;

  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date_butoir: string;

  @IsOptional()
  @IsIn(['basse', 'normale', 'haute', 'urgente'])
  priorite?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  titre?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date_butoir?: string;

  @IsOptional()
  @IsIn(['À faire', 'En cours', 'Terminé'])
  statut?: string;

  @IsOptional()
  @IsIn(['basse', 'normale', 'haute', 'urgente'])
  priorite?: string;
}
