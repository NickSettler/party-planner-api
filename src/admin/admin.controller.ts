import {
  Controller,
  Get,
  Param,
  Post,
  Render,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { Response } from 'express';
import { LoginGuard } from '../common/guards/login.guard';
import { AuthExceptionsFilter } from '../common/filters/auth-exceptions.filter';

@Controller('admin')
@UseFilters(AuthExceptionsFilter)
export class AdminController {
  @Get('/')
  @Render('index')
  public index() {
    return {
      message: 'ABC',
    };
  }

  @Get('/login')
  @Render('login')
  public login() {
    // return;
  }

  @Post('/login')
  @UseGuards(LoginGuard)
  public loginPost(@Res() res: Response) {
    res.redirect('/admin/home');
  }

  @Get('/home')
  @Render('home')
  @UseGuards(AuthenticatedGuard)
  public home() {
    // return;
  }

  @Get('/error/:code?')
  public error(@Param('code') code: string, @Res() res: Response) {
    res.render('errors/error', {
      code,
    });
  }
}
