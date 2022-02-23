import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';
import { Exclude } from 'class-transformer';
import { hashSync } from 'bcrypt';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: "User's id",
    example: 1,
  })
  id: number;

  @Column({
    unique: true,
  })
  @ApiProperty({
    description: "User's email",
    example: 'user@domain.net',
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  refresh_token?: string;

  @CreateDateColumn()
  @ApiProperty({
    description: "User's creation date",
    example: '2020-01-01T00:00:00.000Z',
    type: 'date-time',
  })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: "User's last update date",
    example: '2020-01-01T00:00:00.000Z',
    type: 'date-time',
  })
  updated_at: Date;

  @OneToMany(() => Event, (event) => event.created_by)
  @ApiProperty({
    description: "User's events",
    type: () => [Event],
  })
  own_events: Array<Event>;

  @Column({
    type: 'enum',
    array: true,
    enum: Role,
    default: Role.USER,
  })
  @ApiProperty({
    description: "User's role",
    example: 'USER',
    enum: Role,
  })
  roles: Role[];

  @BeforeInsert()
  async hashPassword() {
    this.password = hashSync(this.password, 10);
  }
}
