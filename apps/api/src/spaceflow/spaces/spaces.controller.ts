import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto, UpdateSpaceDto } from './dto/create-space.dto';

interface AuthUser { id: string }

@Controller('spaceflow/spaces')
@UseGuards(SupabaseAuthGuard)
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.spacesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.spacesService.findOne(id, user.id);
  }

  @Post()
  create(@Body() dto: CreateSpaceDto, @CurrentUser() user: AuthUser) {
    return this.spacesService.create(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSpaceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.spacesService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.spacesService.remove(id, user.id);
  }
}
