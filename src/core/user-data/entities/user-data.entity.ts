// src/core/user-data/entities/user-data.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ strict: false })
export class UserData {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: [] })
  data: any[];
}

export type UserDataDocument = UserData & Document;
export const UserDataSchema = SchemaFactory.createForClass(UserData);