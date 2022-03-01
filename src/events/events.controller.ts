import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ValidationPipe } from '../validation.pipe';
import { CreateEventDto, UpdateEventDto } from './events.dto';
import { EventsService } from './events.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Event } from '../entities/event.entity';
import { Request, Response } from 'express';
import { User } from '../entities/user.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
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
  @ApiOperation({
    summary: 'Get all events',
    description: 'Get all events',
  })
  @ApiOkResponse({
    description: 'Returns all events.',
    type: () => [Event],
  })
  @ApiNotFoundResponse({
    description: 'No events found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @HttpCode(HttpStatus.OK)
  public async getEvents(@Req() request: Request, @Res() response: Response) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (!rules.can(Action.read, Event)) throw new ForbiddenException();

    const events = (await this.eventsService.findAll())
      .filter((event: Event) => rules.can(Action.read, event))
      .map((event) => plainToInstance(Event, event));

    if (!events.length) throw new NotFoundException('No events found');

    return response.send(instanceToPlain(events));
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Returns an event by id.',
    summary: 'Get event by id',
  })
  @ApiParam({
    description: 'Event id.',
    name: 'id',
    type: String,
  })
  @ApiOkResponse({
    description: 'Returns event by id.',
    type: Event,
  })
  @ApiNotFoundResponse({
    description: 'No event found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @HttpCode(HttpStatus.OK)
  public async getEvent(@Req() request: Request, @Param() id: string) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(Action.read, Event)) throw new ForbiddenException();

    const event = await this.eventsService.findOne(id);

    if (rules.cannot(Action.read, event))
      throw new NotFoundException('No event found');

    if (!event) throw new NotFoundException('No event found');

    return plainToInstance(Event, event);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiOperation({
    description: 'Creates a new event.',
    summary: 'Creates a new event.',
  })
  @ApiBody({
    description: 'Event to create.',
    type: CreateEventDto,
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The event has been successfully created.',
    type: () => Event,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createEventDto: CreateEventDto,
    @Req() request: Request,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(Action.create, Event)) throw new ForbiddenException();

    createEventDto.created_by = request.user as User;

    const createdEvent = await this.eventsService.create(createEventDto);

    if (rules.cannot(Action.read, Event)) throw new ForbiddenException();

    return plainToInstance(
      Event,
      await this.eventsService.findOne(createdEvent.id),
    );
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Update event by id.',
    summary: 'Update event by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event id.',
    type: String,
    required: true,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @ApiNotFoundResponse({
    description: 'No event found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiOkResponse({
    description: 'The event has been successfully updated.',
    type: () => Event,
  })
  public async update(
    @Body() updateEventDto: UpdateEventDto,
    @Param() id: string,
    @Req() request: Request,
  ) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(Action.update, Event)) throw new ForbiddenException();

    const event = await this.eventsService.findOne(id);

    if (!event) throw new NotFoundException();

    if (rules.cannot(Action.update, event)) throw new NotFoundException();

    const updatedEvent = await this.eventsService.update(id, updateEventDto);

    if (rules.cannot(Action.read, updatedEvent)) throw new ForbiddenException();

    return plainToInstance(Event, updatedEvent);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description: 'Delete event by id.',
    summary: 'Delete event by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event id.',
    type: String,
    required: true,
  })
  @ApiNoContentResponse({
    description: 'The event has been successfully deleted.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @ApiNotFoundResponse({
    description: 'No event found.',
  })
  public async delete(@Param() id: string, @Req() request: Request) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(Action.delete, Event)) throw new ForbiddenException();

    const event = await this.eventsService.findOne(id);

    if (!event) throw new NotFoundException();

    if (rules.cannot(Action.delete, event)) throw new NotFoundException();

    await this.eventsService.delete(id);
  }
}
