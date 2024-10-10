// src/core/notifications/dto/create-notification.dto.ts
import { IsInt, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}