// src/core/user-data/repositories/generic-user-data.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { UserDataDocument, UserDataSchema } from '../entities/user-data.entity';

@Injectable()
export class GenericUserDataRepository {
  private models: { [key: string]: Model<UserDataDocument> } = {};

  constructor(@InjectConnection() private connection: Connection) {}

  private getModel(collectionName: string): Model<UserDataDocument> {
    if (!this.models[collectionName]) {
      const modelName = `v3_user_data_${collectionName}`;
      this.models[collectionName] = this.connection.model<UserDataDocument>(modelName, UserDataSchema);
    }
    return this.models[collectionName];
  }

  async findOrCreateUserData(userId: number, collectionName: string): Promise<UserDataDocument> {
    const model = this.getModel(collectionName);
    let userData = await model.findOne({ userId });
    if (!userData) {
      userData = new model({ userId, data: [] });
      await userData.save();
    }
    return userData;
  }

  async updateUserData(userId: number, collectionName: string, newData: any): Promise<UserDataDocument> {
    const userData = await this.findOrCreateUserData(userId, collectionName);
    userData.data = newData;
    return userData.save();
  }
}