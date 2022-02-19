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

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
    default: null,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Cat, (cat) => cat.owner)
  @JoinColumn({ name: 'user_id' })
  cats: Array<Cat>;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
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
