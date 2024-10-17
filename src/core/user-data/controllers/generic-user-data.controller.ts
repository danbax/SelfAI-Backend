// src/core/user-data/controllers/generic-user-data.controller.ts

import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { GenericUserDataService } from '../services/generic-user-data.service';
import { TokenValidationGuard } from 'src/common/guards/token-validation.guard';
import { UserRequest } from '../../../common/interfaces/user-request.interface';

@Controller('user-data')
export class GenericUserDataController {
  constructor(private readonly userDataService: GenericUserDataService) {}

  @Get(':collectionName')
  @UseGuards(TokenValidationGuard)
  async getUserData(
    @Req() req: UserRequest,
    @Param('collectionName') collectionName: string
  ): Promise<any[]> {
    const userId = req.user.id;
    return this.userDataService.getUserData(userId, collectionName);
  }

  @Post(':collectionName')
  @UseGuards(TokenValidationGuard)
  async setUserData(
    @Req() req: UserRequest,
    @Param('collectionName') collectionName: string,
    @Body() newData: any
  ): Promise<any> {
    const userId = req.user.id;
    return this.userDataService.updateUserData(userId, collectionName, newData);
  }
}