import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cat } from '../cats/cat.entity';
import * as CryptoJS from 'crypto-js';

@Entity({
  name: 'users',
  synchronize: true,
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

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

  @BeforeInsert()
  async hashPassword() {
    const key = process.env.PASSWORD_KEY;
    this.password = CryptoJS.AES.encrypt(this.password, key).toString(
      CryptoJS.format.Hex,
    );
  }

  @AfterLoad()
  async decryptPassword() {
    const key = process.env.PASSWORD_KEY;
    this.password = CryptoJS.AES.decrypt(this.password, key).toString(
      CryptoJS.enc.Utf8,
    );
  }
}
