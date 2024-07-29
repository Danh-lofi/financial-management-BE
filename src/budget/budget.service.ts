import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget, BudgetDocument } from './schemas/budget.schema';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private _budgetModel: Model<BudgetDocument>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const createdBudget = new this._budgetModel({
      ...createBudgetDto,
    });
    return createdBudget.save();
  }

  async findAll(): Promise<Budget[]> {
    return this._budgetModel.find().populate('category').exec();
  }

  async findOne(id: string): Promise<Budget | null> {
    return this._budgetModel.findById(id).populate('category').exec();
  }

  async update(
    id: string,
    updateBudgetDto: Partial<CreateBudgetDto>,
  ): Promise<Budget | null> {
    return this._budgetModel
      .findByIdAndUpdate(id, updateBudgetDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Budget | null> {
    return this._budgetModel.findByIdAndDelete(id).exec();
  }
}
