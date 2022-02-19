import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((error) => error.constraints),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return value;
  }

  private toValidate(metatype: unknown) {
    const types: unknown[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
