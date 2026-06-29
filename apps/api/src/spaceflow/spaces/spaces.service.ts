import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
import { CreateSpaceDto, UpdateSpaceDto } from './dto/create-space.dto';

@Injectable()
export class SpacesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .from('espaces')
      .select('*, reservations(count)')
      .eq('user_id', userId)
      .eq('actif', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from('espaces')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new NotFoundException('Salle introuvable');
    return data;
  }

  async create(dto: CreateSpaceDto, userId: string) {
    const { data, error } = await this.supabase
      .from('espaces')
      .insert({ ...dto, user_id: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: UpdateSpaceDto, userId: string) {
    await this.assertOwner(id, userId);

    const { data, error } = await this.supabase
      .from('espaces')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string, userId: string) {
    await this.assertOwner(id, userId);

    // Soft delete
    const { data, error } = await this.supabase
      .from('espaces')
      .update({ actif: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { message: 'Salle désactivée', data };
  }

  private async assertOwner(id: string, userId: string) {
    const { data } = await this.supabase
      .from('espaces')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!data) throw new NotFoundException('Salle introuvable');
    if (data.user_id !== userId) throw new ForbiddenException('Accès refusé');
  }
}
