// src/core/user-data/listeners/user-data-update.listener.ts

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GenericUserDataService } from '../services/generic-user-data.service';

@Injectable()
export class UserDataUpdateListener {
  constructor(private userDataService: GenericUserDataService) {}

  @OnEvent('update.user.data')
  async handleUserDataUpdate(payload: { userId: number; collectionName: string; newData: any }) {
    const { userId, collectionName, newData } = payload;
    await this.userDataService.updateUserData(userId, collectionName, newData);
  }
}