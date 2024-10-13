// src/core/user-data/controllers/generic-user-data.controller.ts

import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { GenericUserDataService } from '../services/generic-user-data.service';

@Controller('user-data')
export class GenericUserDataController {
  constructor(private readonly userDataService: GenericUserDataService) {}

  @Get(':userId/:collectionName')
  async getUserData(
    @Param('userId') userId: string,
    @Param('collectionName') collectionName: string
  ): Promise<any[]> {
    return this.userDataService.getUserData(userId, collectionName);
  }

  @Post(':userId/:collectionName')
  async setUserData(
    @Param('userId') userId: string,
    @Param('collectionName') collectionName: string,
    @Body() newData: any
  ): Promise<any> {
    return this.userDataService.updateUserData(userId, collectionName, newData);
  }
}