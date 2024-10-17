// src/core/user-data/user-data.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenericUserDataRepository } from './repositories/generic-user-data.repository';
import { GenericUserDataService } from './services/generic-user-data.service';
import { GenericUserDataController } from './controllers/generic-user-data.controller';
import { UserData, UserDataSchema } from './entities/user-data.entity';
import { UserDataUpdateListener } from './listeners/user-data-update.listener';
import { TokenValidationGuard } from 'src/common/guards/token-validation.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserData.name, schema: UserDataSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenValidationGuard, UserDataUpdateListener, GenericUserDataRepository, GenericUserDataService],
  controllers: [GenericUserDataController],
  exports: [TokenValidationGuard, GenericUserDataService],
})
export class UserDataModule {}