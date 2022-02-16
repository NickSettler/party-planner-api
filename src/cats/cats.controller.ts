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

@Controller('cats')
export class CatsController {
  @Get()
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  public findAll(@Req() request: Request): string {
    return `Get all cats. Method: ${request.method}`;
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
