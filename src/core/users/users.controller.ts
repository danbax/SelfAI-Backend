// src/core/users/controllers/user-settings.controller.ts

import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { TokenValidationGuard } from '../../common/guards/token-validation.guard';
import { UserRequest } from '../../common/interfaces/user-request.interface';

@Controller('users')
@UseGuards(TokenValidationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('settings')
  async getSettings(@Req() req: UserRequest) {
    return this.usersService.getSettings(req.user.id);
  }

  @Put('settings')
  async updateSettings(
    @Req() req: UserRequest,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.usersService.updateSettings(req.user.id, updateUserSettingsDto);
  }
}