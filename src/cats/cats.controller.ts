import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Cat } from '../entities/cat.entity';

@Controller('cats')
@ApiTags('cats')
@ApiBearerAuth()
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to access this route',
  })
  @ApiOkResponse({
    description: 'Returns all cats',
    type: [Cat],
  })
  public async findAll() {
    const cats = await this.catsService.findAll();

    if (!cats || cats.length === 0) throw new NotFoundException();
    return cats;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Return a cat by id',
    type: Cat,
  })
  @ApiNotFoundResponse({
    description: 'Cat not found',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to access this route',
  })
  @ApiParam({
    name: 'id',
    description: 'Cat id',
    required: true,
    type: Number,
  })
  public async find(@Param('id') id: number) {
    const cat = await this.catsService.findOne(id);

    if (!cat) throw new NotFoundException();
    return cat;
  }
}
