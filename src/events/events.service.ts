import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './events.dto';

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

  public async findOne(id: string): Promise<Event> {
    return await this.eventsRepository.findOne(id, {
      relations: ['members'],
    });
  }

  public create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsRepository.save(createEventDto);
  }
}
