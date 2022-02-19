import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'cats',
})
export class Cat {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the cat',
    example: 1,
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'The name of the cat',
    example: 'Garfield',
  })
  name: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: 'The date and time the cat was created',
    example: '2020-01-01T00:00:00.000Z',
    type: 'date-time',
  })
  date_of_birth: Date;

  @ManyToOne(() => User, (user) => user.cats)
  @JoinColumn({ name: 'owner' })
  @ApiProperty({
    description: 'The user that owns the cat',
    type: () => User,
  })
  owner: User;
}
