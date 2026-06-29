import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TasksScheduler {
  private readonly logger = new Logger(TasksScheduler.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly mailerService: MailerService,
  ) {}

  // Tourne tous les jours à 8h00 UTC
  @Cron('0 8 * * *', { name: 'j7-notification' })
  async sendJ7Notifications() {
    this.logger.log('Démarrage du cron J-7...');

    const tasks = await this.tasksService.getTasksDueInSevenDays();
    this.logger.log(`${tasks.length} tâche(s) arrivent à échéance dans 7 jours`);

    for (const task of tasks) {
      const email = task.evenements?.profils?.email;
      const nomUtilisateur = task.evenements?.profils?.nom_complet;
      const nomEvenement = task.evenements?.nom;

      if (!email) {
        this.logger.warn(`Pas d'email pour la tâche ${task.id}`);
        continue;
      }

      try {
        await this.mailerService.sendMail({
          to: email,
          subject: `⏰ Rappel J-7 : "${task.titre}" arrive à échéance`,
          html: this.buildEmailTemplate({
            nomUtilisateur,
            nomEvenement,
            titreTache: task.titre,
            description: task.description,
            dateButoir: task.date_butoir,
          }),
        });

        await this.tasksService.markNotificationSent(task.id);
        this.logger.log(`Email envoyé à ${email} pour la tâche "${task.titre}"`);
      } catch (err) {
        this.logger.error(`Échec d'envoi pour la tâche ${task.id}`, err);
      }
    }
  }

  private buildEmailTemplate(data: {
    nomUtilisateur: string;
    nomEvenement: string;
    titreTache: string;
    description?: string;
    dateButoir: string;
  }): string {
    const date = new Date(data.dateButoir).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: auto; background: #0F172A; color: #fff; padding: 32px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #3B82F6; font-size: 28px; margin: 0;">Bookimo</h1>
          <p style="color: #94a3b8; font-size: 14px;">AuraPlan — Rappel automatique</p>
        </div>

        <p style="font-size: 16px; color: #e2e8f0;">Bonjour <strong>${data.nomUtilisateur}</strong>,</p>

        <p style="color: #cbd5e1;">La tâche suivante de votre événement <strong style="color: #F97316;">${data.nomEvenement}</strong> arrive à échéance dans <strong>7 jours</strong> :</p>

        <div style="background: #1e293b; border-left: 4px solid #F97316; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f1f5f9; margin: 0 0 8px 0;">📌 ${data.titreTache}</h3>
          ${data.description ? `<p style="color: #94a3b8; margin: 0 0 8px 0;">${data.description}</p>` : ''}
          <p style="color: #F97316; font-weight: bold; margin: 0;">📅 Date limite : ${date}</p>
        </div>

        <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-top: 32px;">
          Ne laissez pas cette tâche vous échapper !<br/>
          <a href="#" style="color: #3B82F6;">Ouvrir Bookimo</a>
        </p>
      </div>
    `;
  }
}
