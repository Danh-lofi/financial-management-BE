import { AuthenticationGuard } from '@/auth/guards/auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReportService } from './report.service';
import { ITransactionReport } from '@/shared/dto/transaction-report.dto';
import { ITopCategoriesTransactionReport } from '@/shared/dto/top-categories-transaction-report.dto';

@ApiTags('reports')
@Controller('reports')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard)
export class ReportController {
  constructor(private readonly _reportService: ReportService) {}

  @Get('expense-report')
  @ApiOperation({ summary: 'Get report expense' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getExpenseReportAll(): Promise<ITransactionReport> {
    return this._reportService.getExpenseReportAllService();
  }

  @Get('top-category-expense')
  @ApiOperation({ summary: 'Get report expense' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getTopCategoryExpense(): Promise<ITopCategoriesTransactionReport[]> {
    return this._reportService.getTopCategoryExpenseService();
  }
}
