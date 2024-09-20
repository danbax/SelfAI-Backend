import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mysqlConfig from '../config/mysql.config';

import { User } from '../core/users/entities/user.mysql-entity'
import { Chat} from '../core/chat/entities/chat.entity'
import { Message } from '../core/chat/entities/message.entity'
import { Session } from '../core/chat/entities/session.entity'
import { SessionTranslation } from '../core/sessions/entities/session-translation.entity'
import { Category } from '../core/sessions/entities/category.entity'
import { CategoryTranslation } from '../core/sessions/entities/category-translation.entity'

@Module({
  imports: [
    ConfigModule.forFeature(mysqlConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('mysql'),
        logging: 'all',
        maxQueryExecutionTime: 10000,
        entities: [
          User,
          Chat, 
          Message, 
          Session,
          SessionTranslation,
          Category,
          CategoryTranslation
        ],
        synchronize: false
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MysqlDatabaseModule {}
