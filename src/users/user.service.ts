import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this._userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(username: string): Promise<User | undefined> {
    return this._userModel.findOne({ username }).exec();
  }
}
