import { ITransactionReport } from '@/shared/dto/transaction-report.dto';
import { TransactionService } from '@/transaction/transaction.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetExpenseReportAllUseCase {
  constructor(private readonly transactionService: TransactionService) {}

  async execute(): Promise<ITransactionReport> {
    const result: ITransactionReport =
      await this.transactionService.getTotalTransactionGroupByTransactionType();

    return result;
  }
}
