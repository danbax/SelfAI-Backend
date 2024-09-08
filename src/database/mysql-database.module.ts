import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mysqlConfig from '../config/mysql.config';

@Module({
  imports: [
    ConfigModule.forFeature(mysqlConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.get('mysql'),
      inject: [ConfigService],
    }),
  ],
})
export class MysqlDatabaseModule {}
