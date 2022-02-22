import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './auth.dto';
import { jwtConstants } from './consts';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  public generateTokenCookie(user: any) {
    const payload = { userId: user.id };

    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.expiresIn}`;
  }

  public async register(registerDto: RegisterUserDto) {
    const user = await this.usersService.create(registerDto);

    const { password, ...result } = user;

    return result;
  }
}
