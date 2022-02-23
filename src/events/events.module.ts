import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), CaslModule],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
