import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async findBySpace(spaceId: string, userId: string) {
    await this.assertSpaceOwner(spaceId, userId);

    const { data, error } = await this.supabase
      .from('reservations')
      .select('*, clients(nom_complet, telephone, email)')
      .eq('espace_id', spaceId)
      .neq('statut_reservation', 'Annule')
      .order('date_debut', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .from('reservations')
      .select('*, espaces!inner(nom, user_id), clients(nom_complet, telephone)')
      .eq('espaces.user_id', userId)
      .order('date_debut', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from('reservations')
      .select(
        '*, espaces!inner(nom, user_id, tarif_base), clients(*), paiements(*)',
      )
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Réservation introuvable');
    if ((data as any).espaces.user_id !== userId)
      throw new ForbiddenException('Accès refusé');
    return data;
  }

  async create(dto: CreateReservationDto, userId: string) {
    await this.assertSpaceOwner(dto.espace_id, userId);
    await this.checkOverlap(dto.espace_id, dto.date_debut, dto.date_fin);

    const { data, error } = await this.supabase
      .from('reservations')
      .insert(dto)
      .select()
      .single();

    if (error) {
      // La contrainte PostgreSQL lève une erreur 23P01 en cas d'overlap
      if (error.code === '23P01' || error.message.includes('no_overlap')) {
        throw new ConflictException(
          'Cette plage horaire est déjà réservée pour cette salle',
        );
      }
      throw new Error(error.message);
    }

    return data;
  }

  async update(id: string, dto: UpdateReservationDto, userId: string) {
    await this.assertReservationOwner(id, userId);

    const { data, error } = await this.supabase
      .from('reservations')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Mettre à jour le statut de paiement si acompte = montant total
    if (dto.acompte_verse !== undefined) {
      const reservation = data as any;
      if (reservation.acompte_verse >= reservation.montant_total) {
        await this.supabase
          .from('reservations')
          .update({ statut_paiement: 'Solde' })
          .eq('id', id);
      } else if (reservation.acompte_verse > 0) {
        await this.supabase
          .from('reservations')
          .update({ statut_paiement: 'Acompte verse' })
          .eq('id', id);
      }
    }

    return data;
  }

  async cancel(id: string, userId: string) {
    await this.assertReservationOwner(id, userId);

    const { data, error } = await this.supabase
      .from('reservations')
      .update({ statut_reservation: 'Annule' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Vérification d'overlap au niveau applicatif (double sécurité)
  private async checkOverlap(
    spaceId: string,
    dateDebut: string,
    dateFin: string,
    excludeId?: string,
  ) {
    let query = this.supabase
      .from('reservations')
      .select('id, date_debut, date_fin')
      .eq('espace_id', spaceId)
      .neq('statut_reservation', 'Annule')
      .lt('date_debut', dateFin)
      .gt('date_fin', dateDebut);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data } = await query;

    if (data && data.length > 0) {
      throw new ConflictException(
        'Cette plage horaire est déjà réservée pour cette salle',
      );
    }
  }

  private async assertSpaceOwner(spaceId: string, userId: string) {
    const { data } = await this.supabase
      .from('espaces')
      .select('user_id')
      .eq('id', spaceId)
      .single();

    if (!data) throw new NotFoundException('Salle introuvable');
    if (data.user_id !== userId) throw new ForbiddenException('Accès refusé');
  }

  private async assertReservationOwner(id: string, userId: string) {
    const { data } = await this.supabase
      .from('reservations')
      .select('espaces!inner(user_id)')
      .eq('id', id)
      .single();

    if (!data) throw new NotFoundException('Réservation introuvable');
    if ((data as any).espaces.user_id !== userId)
      throw new ForbiddenException('Accès refusé');
  }
}
