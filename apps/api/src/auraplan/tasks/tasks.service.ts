import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async findByEvent(eventId: string, userId: string) {
    // Vérifie que l'événement appartient à l'utilisateur
    await this.assertEventOwner(eventId, userId);

    const { data, error } = await this.supabase
      .from('taches_plan_action')
      .select('*')
      .eq('evenement_id', eventId)
      .order('date_butoir', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async create(dto: CreateTaskDto, userId: string) {
    await this.assertEventOwner(dto.evenement_id, userId);

    const { data, error } = await this.supabase
      .from('taches_plan_action')
      .insert(dto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    await this.assertTaskOwner(id, userId);

    const { data, error } = await this.supabase
      .from('taches_plan_action')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string, userId: string) {
    await this.assertTaskOwner(id, userId);

    const { error } = await this.supabase
      .from('taches_plan_action')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { message: 'Tâche supprimée' };
  }

  // Utilisé par le scheduler J-7
  async getTasksDueInSevenDays(): Promise<any[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    const dateStr = targetDate.toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from('taches_plan_action')
      .select(`
        *,
        evenements (
          nom,
          profils ( nom_complet, email )
        )
      `)
      .eq('date_butoir', dateStr)
      .neq('statut', 'Terminé')
      .eq('notification_envoyee', false);

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async markNotificationSent(taskId: string) {
    await this.supabase
      .from('taches_plan_action')
      .update({ notification_envoyee: true })
      .eq('id', taskId);
  }

  private async assertEventOwner(eventId: string, userId: string) {
    const { data } = await this.supabase
      .from('evenements')
      .select('user_id')
      .eq('id', eventId)
      .single();

    if (!data) throw new NotFoundException('Événement introuvable');
    if (data.user_id !== userId) throw new ForbiddenException('Accès refusé');
  }

  private async assertTaskOwner(taskId: string, userId: string) {
    const { data } = await this.supabase
      .from('taches_plan_action')
      .select('evenement_id, evenements!inner(user_id)')
      .eq('id', taskId)
      .single();

    if (!data) throw new NotFoundException('Tâche introuvable');
    if ((data as any).evenements.user_id !== userId)
      throw new ForbiddenException('Accès refusé');
  }
}
