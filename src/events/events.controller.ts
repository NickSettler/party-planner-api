import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Event } from '../entities/event.entity';
import { Request, Response } from 'express';
import { User } from '../entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Action } from '../casl/types';

@Controller('events')
@ApiTags('events')
@ApiCookieAuth()
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Returns all events',
    type: [Event],
  })
  @ApiNotFoundResponse({
    description: 'No events found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @HttpCode(HttpStatus.OK)
  public async getEvents(@Req() request: Request, @Res() response: Response) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);
    const events = (await this.eventsService.findAll()).filter((event: Event) =>
      rules.can(Action.read, event),
    );

    if (!events.length) throw new NotFoundException('No events found');

    return response.send(instanceToPlain(events));
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Returns event by id',
    type: Event,
  })
  @ApiNotFoundResponse({
    description: 'No event found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @HttpCode(HttpStatus.OK)
  public async getEvent(@Req() request: Request, @Param() id: string) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(Action.read, Event))
      throw new ForbiddenException('Forbidden');

    const event = await this.eventsService.findOne(id);

    if (rules.cannot(Action.read, event))
      throw new NotFoundException('No event found');

    if (!event) throw new NotFoundException('No event found');

    return event;
  }

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
    if (
      this.caslAbilityFactory
        .createForUser(request.user as User)
        .cannot(Action.create, Event)
    )
      throw new ForbiddenException();
    createEventDto.created_by = request.user as User;
    return await this.eventsService.create(createEventDto);
  }
}
