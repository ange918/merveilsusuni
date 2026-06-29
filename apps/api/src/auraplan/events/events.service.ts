import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .from('evenements')
      .select('*, taches_plan_action(count)')
      .eq('user_id', userId)
      .order('date_evenement', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from('evenements')
      .select('*, taches_plan_action(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new NotFoundException('Événement introuvable');
    return data;
  }

  async create(dto: CreateEventDto, userId: string) {
    const { data, error } = await this.supabase
      .from('evenements')
      .insert({ ...dto, user_id: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    await this.assertOwner(id, userId);

    const { data, error } = await this.supabase
      .from('evenements')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string, userId: string) {
    await this.assertOwner(id, userId);

    const { error } = await this.supabase
      .from('evenements')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { message: 'Événement supprimé' };
  }

  private async assertOwner(id: string, userId: string) {
    const { data } = await this.supabase
      .from('evenements')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!data) throw new NotFoundException('Événement introuvable');
    if (data.user_id !== userId) throw new ForbiddenException('Accès refusé');
  }
}
