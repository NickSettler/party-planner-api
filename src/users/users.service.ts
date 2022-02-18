import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';

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

  public async create(createDto: CreateUserDto): Promise<User> {
    const { username, password } = createDto;

    const userInDb = await this.userRepository.findOne({
      username,
    });

    if (userInDb)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    const user: User = await this.userRepository.create({
      username,
      password,
    });
    await this.userRepository.save(user);
    return user;
  }
}
