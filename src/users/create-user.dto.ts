import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: "User's email",
  })
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: "User's password",
    minLength: 6,
  })
  password: string;
}
