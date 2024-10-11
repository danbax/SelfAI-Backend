// src/core/user-data/services/generic-user-data.service.ts

import { Injectable } from '@nestjs/common';
import { GenericUserDataRepository } from '../repositories/generic-user-data.repository';

@Injectable()
export class GenericUserDataService {
  constructor(private readonly repository: GenericUserDataRepository) {}

  async getUserData(userId: string, collectionName: string): Promise<any[]> {
    return this.repository.getUserData(userId, collectionName);
  }

  async addUserData(userId: string, collectionName: string, newData: any): Promise<any> {
    return this.repository.addUserData(userId, collectionName, newData);
  }

  async updateUserData(userId: string, collectionName: string, dataId: string, updatedData: any): Promise<any> {
    return this.repository.updateUserData(userId, collectionName, dataId, updatedData);
  }

  async deleteUserData(userId: string, collectionName: string, dataId: string): Promise<any> {
    return this.repository.deleteUserData(userId, collectionName, dataId);
  }
}