import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidationPipe } from '../validation.pipe';
import { AuthUserDto, RegisterUserDto } from './auth.dto';
import { User } from '../entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User logged in successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiBody({
    description: 'User credentials',
    type: AuthUserDto,
  })
  public async login(@Req() request: Request, @Res() response: Response) {
    const cookie = this.authService.generateTokenCookie(request.user);
    response.setHeader('Set-Cookie', cookie);

    return response.send(request.user);
  }

  @UsePipes(ValidationPipe)
  @Post('register')
  @ApiCreatedResponse({
    description: 'User created',
    type: () => User,
  })
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
