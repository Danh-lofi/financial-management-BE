import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private _categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this._categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this._categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category | null> {
    return this._categoryModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCategoryDto: Partial<CreateCategoryDto>,
  ): Promise<Category | null> {
    return this._categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Category | null> {
    return this._categoryModel.findByIdAndDelete(id).exec();
  }
}
