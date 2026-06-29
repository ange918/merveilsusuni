import { Module } from '@nestjs/common';
import { SpacesModule } from './spaces/spaces.module';
import { ReservationsModule } from './reservations/reservations.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [SpacesModule, ReservationsModule, InvoicesModule],
})
export class SpaceflowModule {}
