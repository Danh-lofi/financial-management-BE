import { Injectable } from '@nestjs/common';
import { GetExpenseReportAllUseCase } from './use-cases/get-expense-report-all.usecase';
import { GetTopCategoryExpenseUseCase } from './use-cases/get-top-categories-expense.usecase';

@Injectable()
export class ReportService {
  constructor(
    private readonly getExpenseReportAll: GetExpenseReportAllUseCase,
    private readonly getTopCategoryExpense: GetTopCategoryExpenseUseCase,
  ) {}

  async getExpenseReportAllService() {
    return this.getExpenseReportAll.execute();
  }

  async getTopCategoryExpenseService() {
    return this.getTopCategoryExpense.execute();
  }
}
