// src/core/user-data/services/generic-user-data.service.ts

import { Injectable } from '@nestjs/common';
import { GenericUserDataRepository } from '../repositories/generic-user-data.repository';

@Injectable()
export class GenericUserDataService {
  constructor(private readonly repository: GenericUserDataRepository) {}

  async getUserData(userId: number, collectionName: string): Promise<any[]> {
    const userData = await this.repository.findOrCreateUserData(userId, collectionName);
    console.log('userData', userData);
    return userData.data || [];
  }

  async updateUserData(userId: number, collectionName: string, newData: any): Promise<any> {
    return this.repository.updateUserData(userId, collectionName, newData);
  }
}