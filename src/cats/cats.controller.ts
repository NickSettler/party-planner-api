import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Cat } from '../entities/cat.entity';

@Controller('cats')
@ApiTags('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to access this route',
  })
  @ApiOkResponse({
    description: 'List of cats',
    type: [Cat],
  })
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
