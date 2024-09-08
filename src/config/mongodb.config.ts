import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  type: 'mongodb',
  url: process.env.MONGODB_URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
}));
