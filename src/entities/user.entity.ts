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
  @ApiProperty()
  id: number;

  @Column({
    unique: true,
  })
  @ApiProperty()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  updated_at: Date;

  @OneToMany(() => Cat, (cat) => cat.owner)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty()
  cats: Array<Cat>;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  @ApiProperty()
  role: Role[];

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
