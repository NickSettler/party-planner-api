import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[] | undefined> {
    return this.userRepository.find({ relations: ['cats'] });
  }

  public findOne(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }
}
