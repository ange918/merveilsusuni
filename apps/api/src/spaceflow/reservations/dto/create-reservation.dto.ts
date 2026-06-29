import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  espace_id: string;

  @IsOptional()
  @IsUUID()
  client_id?: string;

  @IsDateString()
  date_debut: string;

  @IsDateString()
  date_fin: string;

  @IsNumber()
  @Min(0)
  montant_total: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  acompte_verse?: number;

  @IsOptional()
  @IsIn(['Option', 'Confirme', 'Annule'])
  statut_reservation?: string;

  @IsOptional()
  options_selectionnees?: Record<string, number>;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateReservationDto {
  @IsOptional()
  @IsIn(['Option', 'Confirme', 'Annule'])
  statut_reservation?: string;

  @IsOptional()
  @IsIn(['En attente', 'Acompte verse', 'Solde'])
  statut_paiement?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  acompte_verse?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  montant_total?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
