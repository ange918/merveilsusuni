import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksScheduler } from './tasks.scheduler';
import { supabaseClientFactory } from '../../config/supabase.config';

@Module({
  controllers: [TasksController],
  providers: [supabaseClientFactory, TasksService, TasksScheduler],
  exports: [TasksService],
})
export class TasksModule {}
