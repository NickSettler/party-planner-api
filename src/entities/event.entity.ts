import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Geometry } from 'geojson';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'events',
})
export class Event<CASL extends boolean = false> {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    type: 'integer',
    description: 'The unique identifier for the event',
    example: 1,
    readOnly: true,
    nullable: false,
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @ApiProperty({
    type: 'string',
    description: 'The name of the event',
    example: 'Event 1',
    required: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    description: 'The description of the event',
    example: 'Super duper party!',
    required: false,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @ApiProperty({
    type: 'date-time',
    description: 'The date and time of the event',
    example: '2020-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  datetime: Date;

  @Column({
    type: 'geography',
    nullable: true,
  })
  @ApiProperty({
    type: 'geo-point',
    description: 'The location of the event',
    example: {
      type: 'Point',
      coordinates: [49.8, 15.05],
    },
    required: false,
    nullable: true,
  })
  location: Geometry;

  @CreateDateColumn()
  @ApiProperty({
    type: 'date-time',
    description: 'The date and time of the event',
    example: '2020-01-01T00:00:00.000Z',
    readOnly: true,
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({
    type: 'date-time',
    description: 'The date and time of the event',
    example: '2020-01-01T00:00:00.000Z',
    readOnly: true,
    nullable: false,
  })
  updated_at: Date;

  @Column({
    name: 'created_by',
    type: 'int',
    nullable: false,
    unsigned: true,
  })
  @ManyToOne(() => User, (user) => user.own_events)
  @JoinColumn({ name: 'created_by' })
  @ApiProperty({
    type: () => User,
    description: 'The user that created the event',
    example: 1,
    readOnly: false,
    nullable: false,
  })
  created_by: CASL extends true ? number : User;
}
