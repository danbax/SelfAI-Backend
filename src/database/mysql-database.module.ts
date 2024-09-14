import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mysqlConfig from '../config/mysql.config';

import { User } from '../core/users/entities/user.mysql-entity'
import { Chat} from '../core/chat/entities/chat.entity'
import { Message } from '../core/chat/entities/message.entity'
import { Session } from '../core/chat/entities/session.entity'

@Module({
  imports: [
    ConfigModule.forFeature(mysqlConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('mysql'),
        logging: 'all',
        maxQueryExecutionTime: 5000,
        entities: [User, Chat, Message, Session]
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MysqlDatabaseModule {}
