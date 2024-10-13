// src/core/user-data/user-data.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenericUserDataRepository } from './repositories/generic-user-data.repository';
import { GenericUserDataService } from './services/generic-user-data.service';
import { GenericUserDataController } from './controllers/generic-user-data.controller';
import { UserData, UserDataSchema } from './entities/user-data.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserData.name, schema: UserDataSchema },
    ]),
  ],
  providers: [GenericUserDataRepository, GenericUserDataService],
  controllers: [GenericUserDataController],
  exports: [GenericUserDataService],
})
export class UserDataModule {}