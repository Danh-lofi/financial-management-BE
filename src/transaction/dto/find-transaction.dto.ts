// dto/find-transaction.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TransactionType } from '../enums/transaction-type.enum';

export class FindTransactionDto {
  @ApiPropertyOptional({
    enum: TransactionType,
    description: 'Filter by transaction type',
  })
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @ApiPropertyOptional({
    description: 'Filter by multiple category IDs',
    type: [String],
    example: ['66f2e9ab12345', '66f2e9ab67890'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  categories?: string[];

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiPropertyOptional({ description: 'Minimum amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'From date (ISO string: YYYY-MM-DD)' })
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'To date (ISO string: YYYY-MM-DD)' })
  @IsOptional()
  toDate?: string;
}
