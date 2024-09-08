import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dbType = configService.get<string>('DB_TYPE');
      let dataSource: DataSource;
      if (dbType === 'mysql') {
        dataSource = new DataSource({
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        });
      } else if (dbType === 'mongodb') {
        dataSource = new DataSource({
          type: 'mongodb',
          url: configService.get<string>('MONGODB_URI'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        });
      } else {
        throw new Error(`Unsupported database type: ${dbType}`);
      }
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
