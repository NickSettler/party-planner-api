import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[] | undefined> {
    return this.userRepository.find({ relations: ['own_events'] });
  }

  public findOne(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  public async create(createDto: CreateUserDto): Promise<User> {
    const { email, password } = createDto;

    const userInDb = await this.userRepository.findOne({
      email,
    });

    if (userInDb)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    const user: User = await this.userRepository.create({
      email,
      password,
    });
    await this.userRepository.save(user);
    return user;
  }
}
