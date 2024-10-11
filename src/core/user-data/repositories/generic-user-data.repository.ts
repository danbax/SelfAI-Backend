// src/core/user-data/repositories/generic-user-data.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { UserData, UserDataSchema } from '../entities/user-data.entity';

@Injectable()
export class GenericUserDataRepository {
  private models: { [key: string]: Model<UserData> } = {};

  constructor(@InjectConnection() private connection: Connection) {}

  private getModel(collectionName: string): Model<UserData> {
    if (!this.models[collectionName]) {
      const modelName = `v3_user_data_${collectionName}`;
      this.models[collectionName] = this.connection.model<UserData>(modelName, UserDataSchema);
    }
    return this.models[collectionName];
  }

  async findOrCreateUserData(userId: string, collectionName: string): Promise<UserData> {
    const model = this.getModel(collectionName);
    let userData = await model.findOne({ userId });
    if (!userData) {
      userData = new model({ userId, data: [] });
      await userData.save();
    }
    return userData;
  }

  async getUserData(userId: string, collectionName: string): Promise<any[]> {
    const userData = await this.findOrCreateUserData(userId, collectionName);
    return userData.data;
  }

  async addUserData(userId: string, collectionName: string, newData: any): Promise<UserData> {
    const model = this.getModel(collectionName);
    const userData = await this.findOrCreateUserData(userId, collectionName);
    userData.data.push(newData);
    return userData.save();
  }

  async updateUserData(userId: string, collectionName: string, dataId: string, updatedData: any): Promise<UserData> {
    const model = this.getModel(collectionName);
    const userData = await this.findOrCreateUserData(userId, collectionName);
    const index = userData.data.findIndex(item => item._id.toString() === dataId);
    if (index !== -1) {
      userData.data[index] = { ...userData.data[index], ...updatedData };
      return userData.save();
    }
    throw new Error('Data item not found');
  }

  async deleteUserData(userId: string, collectionName: string, dataId: string): Promise<UserData> {
    const model = this.getModel(collectionName);
    const userData = await this.findOrCreateUserData(userId, collectionName);
    userData.data = userData.data.filter(item => item._id.toString() !== dataId);
    return userData.save();
  }
}