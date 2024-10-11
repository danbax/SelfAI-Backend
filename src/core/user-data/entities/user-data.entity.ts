// src/core/user-data/entities/user-data.entity.ts

import { Document, Schema } from 'mongoose';

export interface UserData extends Document {
  userId: string;
  data: any;
}

export const UserDataSchema = new Schema({
  userId: { type: String, required: true },
  data: { type: Array, default: [] }
}, { strict: false });
