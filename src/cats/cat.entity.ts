import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({
  name: 'cats',
  synchronize: true,
})
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_of_birth: Date;

  @ManyToOne(() => User, (user) => user.cats)
  @JoinColumn({ name: 'owner' })
  owner: User;
}
