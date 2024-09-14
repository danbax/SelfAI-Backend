import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mysqlConfig from '../config/mysql.config';

import { User } from '../core/users/entities/user.mysql-entity'

@Module({
  imports: [
    ConfigModule.forFeature(mysqlConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('mysql'),
        logging: 'all',
        maxQueryExecutionTime: 1000,
        entities: [User],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MysqlDatabaseModule {}
