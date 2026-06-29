import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

@Injectable()
export class InvoicesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async generateInvoice(
    reservationId: string,
    userId: string,
  ): Promise<Buffer> {
    const reservation = await this.getReservationDetails(
      reservationId,
      userId,
    );

    return this.buildPdf(reservation);
  }

  private async getReservationDetails(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from('reservations')
      .select(
        `
        *,
        espaces!inner(nom, tarif_base, adresse, user_id, profils!inner(nom_complet, email, telephone)),
        clients(nom_complet, telephone, email),
        paiements(*)
      `,
      )
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Réservation introuvable');
    if ((data as any).espaces.user_id !== userId)
      throw new ForbiddenException('Accès refusé');

    return data as any;
  }

  private buildPdf(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const resteAPayer =
        data.montant_total - (data.acompte_verse ?? 0);
      const dateDebut = new Date(data.date_debut).toLocaleDateString('fr-FR');
      const dateFin = new Date(data.date_fin).toLocaleDateString('fr-FR');
      const dateEmission = new Date().toLocaleDateString('fr-FR');
      const numeroFacture = `BOOK-${Date.now().toString().slice(-8)}`;

      // En-tête
      doc
        .fillColor('#0F172A')
        .rect(0, 0, 595, 100)
        .fill();

      doc
        .fillColor('#ffffff')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('BOOKIMO', 50, 30);

      doc
        .fillColor('#0F766E')
        .fontSize(12)
        .font('Helvetica')
        .text('SpaceFlow — Gestion de Salles', 50, 62);

      doc
        .fillColor('#ffffff')
        .fontSize(10)
        .text(`Facture N° ${numeroFacture}`, 400, 35, { align: 'right', width: 145 })
        .text(`Émise le : ${dateEmission}`, 400, 52, { align: 'right', width: 145 });

      // Informations émetteur / client
      doc.moveDown(3);

      doc
        .fillColor('#111827')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('DE :', 50, 120);

      doc
        .font('Helvetica')
        .fillColor('#374151')
        .fontSize(10)
        .text(data.espaces.profils?.nom_complet ?? 'Gérant', 50, 136)
        .text(data.espaces.profils?.email ?? '', 50, 150)
        .text(data.espaces.profils?.telephone ?? '', 50, 164);

      doc
        .fillColor('#111827')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('FACTURÉ À :', 320, 120);

      doc
        .font('Helvetica')
        .fillColor('#374151')
        .fontSize(10)
        .text(data.clients?.nom_complet ?? 'Client', 320, 136)
        .text(data.clients?.email ?? '', 320, 150)
        .text(data.clients?.telephone ?? '', 320, 164);

      // Ligne de séparation
      doc
        .moveTo(50, 195)
        .lineTo(545, 195)
        .strokeColor('#E5E7EB')
        .stroke();

      // Détails de la réservation
      doc
        .fillColor('#0F766E')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('Détail de la prestation', 50, 210);

      // Tableau
      const tableTop = 235;
      doc
        .fillColor('#F9FAFB')
        .rect(50, tableTop, 495, 25)
        .fill();

      doc
        .fillColor('#374151')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Description', 60, tableTop + 8)
        .text('Montant', 480, tableTop + 8, { align: 'right', width: 55 });

      let y = tableTop + 35;

      // Salle
      doc
        .fillColor('#111827')
        .font('Helvetica')
        .text(`Location : ${data.espaces.nom}`, 60, y)
        .text(`${dateDebut} → ${dateFin}`, 60, y + 14, { fontSize: 9 });

      doc
        .fillColor('#111827')
        .text(`${data.espaces.tarif_base} FCFA`, 480, y, {
          align: 'right',
          width: 55,
        });

      y += 40;

      // Options
      if (data.options_selectionnees) {
        for (const [option, prix] of Object.entries(
          data.options_selectionnees as Record<string, number>,
        )) {
          doc
            .fillColor('#374151')
            .text(`Option : ${option}`, 60, y)
            .text(`${prix} FCFA`, 480, y, { align: 'right', width: 55 });
          y += 22;
        }
      }

      // Ligne de séparation
      doc
        .moveTo(50, y + 10)
        .lineTo(545, y + 10)
        .strokeColor('#E5E7EB')
        .stroke();

      y += 25;

      // Totaux
      doc
        .fillColor('#374151')
        .font('Helvetica')
        .text('Montant total :', 350, y)
        .text(`${data.montant_total} FCFA`, 480, y, {
          align: 'right',
          width: 55,
        });

      y += 18;

      doc
        .fillColor('#0F766E')
        .text('Acompte versé :', 350, y)
        .text(`- ${data.acompte_verse ?? 0} FCFA`, 480, y, {
          align: 'right',
          width: 55,
        });

      y += 18;

      // Reste à payer
      doc
        .fillColor('#111827')
        .rect(340, y, 205, 28)
        .fill('#111827');

      doc
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .text('RESTE À PAYER :', 350, y + 8)
        .text(`${resteAPayer} FCFA`, 480, y + 8, {
          align: 'right',
          width: 55,
        });

      // Statut
      const statut = resteAPayer === 0 ? 'SOLDÉ ✓' : 'EN ATTENTE';
      const statutColor = resteAPayer === 0 ? '#0F766E' : '#D97706';

      doc
        .fillColor(statutColor)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(`Statut : ${statut}`, 50, y + 50);

      // Pied de page
      doc
        .fillColor('#9CA3AF')
        .fontSize(9)
        .font('Helvetica')
        .text(
          'Merci pour votre confiance — Bookimo by SpaceFlow',
          50,
          750,
          { align: 'center', width: 495 },
        );

      doc.end();
    });
  }
}
