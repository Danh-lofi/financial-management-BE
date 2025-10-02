import { Module } from '@nestjs/common';

import { TransactionModule } from '@/transaction/transaction.module';
import { ReportController } from './report.controller';
import { GetExpenseReportAllUseCase } from './use-cases/get-expense-report-all.usecase';
import { ReportService } from './report.service';
import { GetTopCategoryExpenseUseCase } from './use-cases/get-top-categories-expense.usecase';

@Module({
  imports: [TransactionModule],
  controllers: [ReportController],
  providers: [
    ReportService,
    GetExpenseReportAllUseCase,
    GetTopCategoryExpenseUseCase,
  ],
})
export class ReportModule {}
