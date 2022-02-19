import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'user@domain.net',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: "User's password",
    example: 'password',
    minLength: 6,
  })
  password: string;
}

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: "User's email",
    example: 'user@domain.net',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: "User's password",
    example: 'password',
    minLength: 6,
  })
  password: string;
}
