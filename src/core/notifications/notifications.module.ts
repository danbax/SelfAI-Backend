// src/core/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { NotificationRepository } from './repositories/notification.repository';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationListener } from './listeners/notification.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    AuthModule,
    
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60d' },
        }),
        inject: [ConfigService],
      }),
],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationListener],
  exports: [NotificationService],
})
export class NotificationsModule {}