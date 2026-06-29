import { Module } from '@nestjs/common';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { supabaseClientFactory } from '../../config/supabase.config';

@Module({
  controllers: [SpacesController],
  providers: [supabaseClientFactory, SpacesService],
  exports: [SpacesService],
})
export class SpacesModule {}
