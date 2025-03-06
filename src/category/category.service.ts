import { RequestContextService } from '@/context/request-context';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpsertCategoryDto } from './dto/create-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
// import { RequestContextService } from '@/context/request-context';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private _categoryModel: Model<CategoryDocument>,
  ) {}

  async upsert(upsertCategoryDto: UpsertCategoryDto): Promise<Category> {
    try {
      const username = RequestContextService.getUsername();
      const { id, ...rest } = upsertCategoryDto;
      const data = {
        ...rest,
        user: username,
      };
      return await this._categoryModel.findOneAndUpdate(
        { id, user: username },
        data,
        {
          new: true,
          upsert: true,
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Category[]> {
    const username = RequestContextService.getUsername();
    return this._categoryModel
      .find({
        user: username,
      })
      .exec();
  }

  async findOne(id: string): Promise<Category | null> {
    const username = RequestContextService.getUsername();
    return this._categoryModel.findOne({ id, user: username }).exec();
  }

  async remove(id: string): Promise<Category | null> {
    const username = RequestContextService.getUsername();
    const selectedCategory = await this._categoryModel
      .find({
        id,
        user: username,
      })
      .exec();
    if (!selectedCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return this._categoryModel
      .findOneAndDelete({
        id,
        user: username,
      })
      .exec();
  }
}
