import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InvoicesService } from './invoices.service';

interface AuthUser { id: string }

@Controller('spaceflow/invoices')
@UseGuards(SupabaseAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':reservationId/pdf')
  async generatePdf(
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @CurrentUser() user: AuthUser,
    @Res() res: any,
  ) {
    const buffer = await this.invoicesService.generateInvoice(
      reservationId,
      user.id,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="facture-${reservationId.slice(0, 8)}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
