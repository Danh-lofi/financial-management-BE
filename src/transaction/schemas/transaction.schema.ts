import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '../../category/schemas/category.schema';
import { User } from '../../users/schemas/user.schema';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ type: String, unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ type: String, ref: Category.name, required: true })
  category: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
