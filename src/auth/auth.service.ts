import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './auth.dto';
import { jwtConstants } from './consts';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && compareSync(password, user.password)) {
      return user;
    }

    return null;
  }

  public generateAccessTokenCookie(user: any) {
    const payload = { userId: user.id };

    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.tokenExpiresIn}`;
  }

  public generateRefreshTokenCookie(user: any) {
    const payload = { userId: user.id };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.refreshExpiresIn}`;

    return {
      cookie,
      token,
    };
  }

  public async register(registerDto: RegisterUserDto) {
    return await this.usersService.create(registerDto);
  }
}
