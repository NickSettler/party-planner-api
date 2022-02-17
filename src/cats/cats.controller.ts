import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async findAll() {
    const cats = await this.catsService.findAll();

    if (!cats || cats.length === 0) throw new NotFoundException();
    return cats;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public async find(@Param('id') id: number) {
    const cat = await this.catsService.findOne(id);

    if (!cat) throw new NotFoundException();
    return cat;
  }
}
