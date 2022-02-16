import {
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  public async findAll(@Req() request: Request, @Res() response: Response) {
    response.status(200).send(await this.catsService.findAll());
  }

  @Get('/:id')
  @Header('Cache-Control', 'none')
  public async find(@Param('id') id: number, @Res() response: Response) {
    const cat = await this.catsService.findOne(id);

    if (cat) {
      response.status(200).send(cat);
    } else {
      response.status(404).send({
        message: 'Cat not found',
      });
    }
  }
}
