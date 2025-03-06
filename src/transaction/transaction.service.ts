import { RequestContextService } from '@/context/request-context';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpsertTransactionDto } from './dto/upsert-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
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

  async findAll(): Promise<Transaction[]> {
    const username = RequestContextService.getUsername();
    return this._transactionModel
      .find({
        user: username,
      })
      .exec();
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
}
