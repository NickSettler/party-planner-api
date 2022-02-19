import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cat } from './cat.entity';
import * as CryptoJS from 'crypto-js';
import { Role } from '../roles/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

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

  @Column()
  password: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: "User's creation date",
    example: '2020-01-01T00:00:00.000Z',
    type: 'date-time',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: "User's last update date",
    example: '2020-01-01T00:00:00.000Z',
    type: 'date-time',
  })
  updated_at: Date;

  @OneToMany(() => Cat, (cat) => cat.owner)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: "User's cats",
    type: () => [Cat],
  })
  cats: Array<Cat>;

  @Column({
    type: 'enum',
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
    const key = process.env.PASSWORD_KEY;
    this.password = CryptoJS.AES.encrypt(this.password, key).toString();
  }

  @AfterLoad()
  async decryptPassword() {
    const key = process.env.PASSWORD_KEY;
    this.password = CryptoJS.AES.decrypt(this.password, key).toString(
      CryptoJS.enc.Utf8,
    );
  }
}
