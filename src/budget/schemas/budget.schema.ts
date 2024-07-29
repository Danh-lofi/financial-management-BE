import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../../category/schemas/category.schema';
import { User } from '../../users/schemas/user.schema';

export type BudgetDocument = Budget & Document;

@Schema()
export class Budget {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: Category.name })
  category?: Types.ObjectId; // Optional reference to a category

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId; // Reference to the user who created the budget

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
