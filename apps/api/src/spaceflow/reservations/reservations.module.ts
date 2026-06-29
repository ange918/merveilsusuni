import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { supabaseClientFactory } from '../../config/supabase.config';

@Module({
  controllers: [ReservationsController],
  providers: [supabaseClientFactory, ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
