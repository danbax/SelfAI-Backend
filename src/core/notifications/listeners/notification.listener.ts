// src/core/notifications/listeners/notification.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationListener {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('notification.create')
  handleNotificationCreate(payload: CreateNotificationDto) {
    this.notificationService.createNotification(payload);
  }
}