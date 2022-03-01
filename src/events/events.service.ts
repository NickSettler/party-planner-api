import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  public async findAll(): Promise<Event[]> {
    return await this.eventsRepository.find({
      relations: ['members'],
    });
  }

  public async findOne(id: string | number): Promise<Event> {
    return await this.eventsRepository.findOne(id, {
      relations: ['members'],
    });
  }

  public async create(createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventsRepository.save({
      ...createEventDto,
      location: () => `ST_GeomFromText('POINT(${createEventDto.location})')`,
    });
  }

  public async update(
    id: string | number,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    await this.eventsRepository.update(id, {
      ...updateEventDto,
      location: () => `ST_GeomFromText('POINT(${updateEventDto.location})')`,
    });

    return await this.eventsRepository.findOne(id, {
      relations: ['members'],
    });
  }

  public async delete(id: string | number) {
    await this.eventsRepository.update(id, {
      deleted: true,
    });
  }
}
