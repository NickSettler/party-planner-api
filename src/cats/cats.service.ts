import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './cat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
  constructor(@InjectRepository(Cat) private catsRepository: Repository<Cat>) {}

  public async findAll(): Promise<Cat[] | undefined> {
    return this.catsRepository.find();
  }

  public findOne(id: number): Promise<Cat | undefined> {
    return this.catsRepository.findOne(id);
  }

  public async remove(id: number): Promise<void> {
    await this.catsRepository.delete(id);
  }
}
