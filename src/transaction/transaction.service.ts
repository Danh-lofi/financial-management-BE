import { RequestContextService } from '@/context/request-context';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UpsertTransactionDto } from './dto/upsert-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import {
  FindTransactionDto,
  TransactionListResponseDto,
} from './dto/find-transaction.dto';
import { TransactionType } from './enums/transaction-type.enum';
import { ITransactionReport } from '@/shared/dto/transaction-report.dto';
import { ITopCategoriesTransactionReport } from '@/shared/dto/top-categories-transaction-report.dto';
// import { RequestContextService } from '@/context/request-context';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private _transactionModel: Model<TransactionDocument>,
  ) {}

  async upsert(
    upsertTransactionDto: UpsertTransactionDto,
  ): Promise<Transaction> {
    const { id, ...rest } = upsertTransactionDto;
    const username = RequestContextService.getUsername();
    const data = {
      ...rest,
      user: username,
    };
    return await this._transactionModel.findOneAndUpdate(
      { id, user: username },
      data,
      {
        new: true,
        upsert: true,
      },
    );
  }

  async findAll(
    query?: FindTransactionDto,
  ): Promise<TransactionListResponseDto> {
    const username = RequestContextService.getUsername();
    const filter: FilterQuery<Transaction> = {
      user: username,
    };

    if (query.transactionType) {
      filter['transactionType'] = query.transactionType;
    }
    if (query.categories?.length) {
      filter.category = { $in: query.categories };
    }
    if (query.minAmount || query.maxAmount) {
      filter.amount = {};
      if (query.minAmount) filter.amount.$gte = query.minAmount;
      if (query.maxAmount) filter.amount.$lte = query.maxAmount;
    }
    if (query.fromDate || query.toDate) {
      filter.transactionDate = {};
      if (query.fromDate)
        filter.transactionDate.$gte = new Date(query.fromDate);
      if (query.toDate) {
        const to = new Date(query.toDate);
        to.setHours(23, 59, 59, 999);
        filter.transactionDate.$lte = to;
      }
    }
    const [transactions, totals] = await Promise.all([
      this._transactionModel.find(filter).sort({ transactionDate: -1 }).exec(),
      this._transactionModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$transactionType',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            transactionType: '$_id',
            totalAmount: 1,
            count: 1,
          },
        },
      ]),
    ]);
    return { transactions, totals };
  }

  async findOne(id: string): Promise<Transaction | null> {
    const username = RequestContextService.getUsername();
    return this._transactionModel.findOne({ id, user: username }).exec();
  }

  async remove(id: string): Promise<Transaction | null> {
    const username = RequestContextService.getUsername();
    const selectedData = await this._transactionModel
      .find({
        id,
        user: username,
      })
      .exec();
    if (!selectedData) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    return this._transactionModel
      .findOneAndDelete({
        id,
        user: username,
      })
      .exec();
  }

  async getTotalTransactionGroupByTransactionType(): Promise<ITransactionReport> {
    const username = RequestContextService.getUsername();

    const result = await this._transactionModel.aggregate([
      {
        $match: {
          user: username,
        },
      },
      {
        $facet: {
          income: [
            { $match: { transactionType: TransactionType.INCOME } },
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' },
              },
            },
          ],
          expense: [
            { $match: { transactionType: TransactionType.EXPENSE } },
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalIncome: { $ifNull: [{ $arrayElemAt: ['$income.total', 0] }, 0] },
          totalExpense: {
            $ifNull: [{ $arrayElemAt: ['$expense.total', 0] }, 0],
          },
        },
      },
    ]);

    return result[0] || { totalIncome: 0, totalExpense: 0 };
  }

  async getExpenseByCategory(): Promise<ITopCategoriesTransactionReport[]> {
    const username = RequestContextService.getUsername();
    return await this._transactionModel.aggregate([
      {
        $match: {
          user: username,
          transactionType: TransactionType.EXPENSE,
        },
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          totalAmount: 1,
          count: 1,
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);
  }
}
