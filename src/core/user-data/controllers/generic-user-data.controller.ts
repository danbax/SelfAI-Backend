// src/core/user-data/controllers/generic-user-data.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { GenericUserDataService } from '../services/generic-user-data.service';

@Controller('user-data')
export class GenericUserDataController {
  constructor(private readonly userDataService: GenericUserDataService) {}

  @Get(':userId/:collectionName')
  async getUserData(@Param('userId') userId: string, @Param('collectionName') collectionName: string) {
    return this.userDataService.getUserData(userId, collectionName);
  }

  @Post(':userId/:collectionName')
  async addUserData(
    @Param('userId') userId: string,
    @Param('collectionName') collectionName: string,
    @Body() newData: any
  ) {
    return this.userDataService.addUserData(userId, collectionName, newData);
  }

  @Put(':userId/:collectionName/:dataId')
  async updateUserData(
    @Param('userId') userId: string,
    @Param('collectionName') collectionName: string,
    @Param('dataId') dataId: string,
    @Body() updatedData: any
  ) {
    return this.userDataService.updateUserData(userId, collectionName, dataId, updatedData);
  }

  @Delete(':userId/:collectionName/:dataId')
  async deleteUserData(
    @Param('userId') userId: string,
    @Param('collectionName') collectionName: string,
    @Param('dataId') dataId: string
  ) {
    return this.userDataService.deleteUserData(userId, collectionName, dataId);
  }
}