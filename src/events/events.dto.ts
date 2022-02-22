import {
  IsDate,
  IsEmpty,
  IsLatLong,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Geometry } from 'geojson';
import { User } from '../entities/user.entity';

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

  @IsLatLong()
  @Validate(() => IsLatLong || IsString)
  @ApiProperty({
    description: "Event's location",
    type: 'string',
    format: 'geo-point',
    example: '49.80, 15.05',
    required: false,
    nullable: true,
  })
  @IsOptional()
  location: Geometry;

  @IsEmpty()
  created_by: User;
}
