// src/core/notifications/controllers/notification.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { TokenValidationGuard } from '../../../common/guards/token-validation.guard';
import { PaginationDTO } from '../../../common/dto/pagination.dto';
import { User, UserPayload } from '../../../common/decorators/user.decorator';

@Controller('notifications')
@UseGuards(TokenValidationGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get()
  async getNotifications(
    @User() user: UserPayload,
    @Query() paginationDto: PaginationDTO,
    @Query('isRead') isRead?: boolean
  ) {
    return this.notificationService.getNotifications(user.id, paginationDto, isRead);
  }

  @Get(':id')
  async getNotification(@Param('id') id: number) {
    return this.notificationService.getNotificationById(id);
  }

  @Put(':id')
  async updateNotification(
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto
  ) {
    return this.notificationService.updateNotification(id, updateNotificationDto);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: number) {
    return this.notificationService.deleteNotification(id);
  }

  @Put('mark-all-read')
  async markAllAsRead(@User() user: UserPayload) {
    return this.notificationService.markAllAsRead(user.id);
  }
}