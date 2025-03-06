import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertCategoryDto {
  @ApiPropertyOptional({
    example: '60f7b3b3-3b1d-4b0b-8b0b-3b1d4b0b8b0b',
    description: 'The id of the category',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Devices and gadgets',
    description: 'A description of the category',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
