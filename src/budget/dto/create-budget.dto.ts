import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty({ example: 'Monthly Rent', description: 'Name of the budget' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1000,
    description: 'Total amount allocated for the budget',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    example: '605c72efb0f2c60f6d9b1e4b',
    description: 'Category associated with the budget',
    required: false,
  })
  @IsOptional()
  category?: string;
}
