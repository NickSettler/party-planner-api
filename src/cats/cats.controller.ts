import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
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
  public find(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: Request,
  ): void {
    response.status(HttpStatus.ACCEPTED).json({
      method: request.method,
      host: request.hostname,
      protocol: request.protocol,
    });
  }
}
