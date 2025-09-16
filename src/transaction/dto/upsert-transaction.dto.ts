import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { format, parse } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { TransactionType } from '../enums/transaction-type.enum';
export class UpsertTransactionDto {
  @ApiPropertyOptional({
    example: '60e6a3e5e3b7b8f5f8b3b3c5',
    description: 'ID giao dịch',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    example: 'Ăn uống',
    description: 'Mô tả giao dịch',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '100000',
    description: 'Số tiền giao dịch',
  })
  @Transform(({ value: amount }) => parseFloat(amount))
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    example: '60e6a3e5e3b7b8f5f8b3b3c5',
    description: 'ID danh mục',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: TransactionType.INCOME,
    description: 'Loại giao dịch',
  })
  @IsEnum(TransactionType, { message: 'type must be income or expense' })
  transactionType: TransactionType;

  @ApiProperty({
    example: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    description: 'Ngày phát hành lệnh',
  })
  @IsNotEmpty()
  @IsDate({
    message: ({ property }) =>
      `${property} must be in the format YYYY-MM-DD HH:mm:ss and represent a valid date`,
  })
  @Transform(({ value }) =>
    value
      ? fromZonedTime(parse(value, 'yyyy-MM-dd HH:mm:ss', new Date()), '+07:00')
      : value,
  )
  transactionDate: Date;
}
