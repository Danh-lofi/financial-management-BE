import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    default: '0934128854',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/)
  phone: string;

  @ApiProperty({
    default: 'danh dev',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    default: 'danh dev',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
