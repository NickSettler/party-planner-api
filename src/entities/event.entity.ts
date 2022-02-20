import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Geometry } from 'geojson';
import { User } from './user.entity';

@Entity({
  name: 'events',
})
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  datetime: Date;

  @Column({
    type: 'geography',
    nullable: true,
  })
  location: Geometry;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'now()',
    onUpdate: 'now()',
  })
  created_at: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'now()',
    onUpdate: 'now()',
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
  created_by: number;
}
