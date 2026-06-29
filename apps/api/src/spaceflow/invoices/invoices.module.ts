import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { supabaseClientFactory } from '../../config/supabase.config';

@Module({
  controllers: [InvoicesController],
  providers: [supabaseClientFactory, InvoicesService],
})
export class InvoicesModule {}
