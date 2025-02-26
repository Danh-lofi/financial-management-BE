// create-user.dto.ts

import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: '0934128854',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsEmpty()
  mail?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsEmpty()
  phone?: string;
}
