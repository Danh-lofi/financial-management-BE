import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpsertTransactionDto } from './dto/upsert-transaction.dto';
import { Transaction } from './schemas/transaction.schema';
import { AuthenticationGuard } from '@/auth/guards/auth.guard';
import { FindTransactionDto } from './dto/find-transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard)
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createCategoryDto: UpsertTransactionDto,
  ): Promise<Transaction> {
    return this._transactionService.upsert(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transaction' })
  @ApiResponse({ status: 200, description: 'Return all transaction.' })
  async findAll(@Query() query: FindTransactionDto): Promise<Transaction[]> {
    return this._transactionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({ status: 200, description: 'Return the transaction.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async findOne(@Param('id') id: string): Promise<Transaction | null> {
    return this._transactionService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been deleted.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async remove(@Param('id') id: string): Promise<Transaction | null> {
    return this._transactionService.remove(id);
  }
}
