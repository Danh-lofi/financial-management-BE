import { ITopCategoriesTransactionReport } from '@/shared/dto/top-categories-transaction-report.dto';
import { TransactionService } from '@/transaction/transaction.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetTopCategoryExpenseUseCase {
  constructor(private readonly transactionService: TransactionService) {}

  async execute(): Promise<ITopCategoriesTransactionReport[]> {
    const result: any = await this.transactionService.getExpenseByCategory();
    return result;
  }
}
