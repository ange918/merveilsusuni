import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { supabaseClientFactory } from '../../config/supabase.config';

@Module({
  controllers: [EventsController],
  providers: [supabaseClientFactory, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
