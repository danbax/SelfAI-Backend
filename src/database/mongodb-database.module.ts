import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongodbConfig from '../config/mongodb.config';

@Module({
  imports: [
    ConfigModule.forFeature(mongodbConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.get('mongodb'),
      inject: [ConfigService],
    }),
  ],
})
export class MongodbDatabaseModule {}
