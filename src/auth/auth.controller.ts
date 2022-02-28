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
import { UsersService } from '../users/users.service';
import { instanceToPlain } from 'class-transformer';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-refresh-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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
    const accessCookie = this.authService.generateAccessTokenCookie(
      request.user,
    );
    const refreshCookie = this.authService.generateRefreshTokenCookie(
      request.user,
    );

    await this.usersService.setRefreshToken(
      refreshCookie.token,
      (request.user as User).id,
    );

    response.setHeader('Set-Cookie', [accessCookie, refreshCookie.cookie]);

    return response.send(instanceToPlain(request.user));
  }

  @UsePipes(ValidationPipe)
  @Post('register')
  @ApiCreatedResponse({
    description: 'User created',
    type: () => User,
  })
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() registerUserDto: RegisterUserDto) {
    const user = this.authService.register(registerUserDto);
    return instanceToPlain(user);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async refresh(@Req() request: Request, @Res() response: Response) {
    const accessToken = this.authService.generateAccessTokenCookie(
      request.user,
    );

    response.setHeader('Set-Cookie', [accessToken]);
    return response.send(instanceToPlain(request.user));
  }
}
