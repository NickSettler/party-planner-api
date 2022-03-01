import {
  IsDate,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'geojson';
import { User } from '../entities/user.entity';
import { LatLngConstraint } from '../common/validation/constraints/LatLng.constraint';

export class CreateEventDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "Event's name",
    type: 'string',
    example: 'Event 1',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: "Event's description",
    type: 'string',
    nullable: true,
    required: false,
    example: 'Super duper party!',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: "Event's date",
    type: 'string',
    format: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  datetime: Date;

  @Validate(LatLngConstraint)
  @ApiProperty({
    description: "Event's location",
    type: 'string',
    format: 'geo-point',
    example: '49.80 15.05',
    required: false,
    nullable: true,
  })
  @IsOptional()
  location: Point;

  @IsEmpty()
  created_by: User;
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Event's name",
    type: 'string',
    example: 'Event 1',
    required: false,
  })
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Event's description",
    type: 'string',
    required: false,
    example: 'Super duper party!',
  })
  description: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Event's date",
    format: 'date-time',
    type: 'string',
    example: '2020-01-01T00:00:00.000Z',
    required: false,
  })
  datetime: string;

  @Validate(LatLngConstraint)
  @ApiProperty({
    description: "Event's location",
    type: 'string',
    format: 'geo-point',
    example: '49.80 15.05',
    required: false,
    nullable: true,
  })
  @IsOptional()
  location: Point;
}
