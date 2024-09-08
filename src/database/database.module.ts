import { Module } from '@nestjs/common';
import { MysqlDatabaseModule } from './mysql-database.module';
import { MongodbDatabaseModule } from './mongodb-database.module';

@Module({
  imports: [
    MysqlDatabaseModule,
    MongodbDatabaseModule,
  ],
})
export class DatabaseModule {}
