import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ValidationPipe } from '../validation.pipe';
import { CreateEventDto } from './events.dto';
import { EventsService } from './events.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Event } from '../entities/event.entity';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Controller('events')
@ApiTags('events')
@ApiCookieAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({
    description: 'The event has been successfully created.',
    type: () => Event,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createEventDto: CreateEventDto,
    @Req() request: Request,
  ) {
    createEventDto.created_by = request.user as User;
    return await this.eventsService.create(createEventDto);
  }
}
