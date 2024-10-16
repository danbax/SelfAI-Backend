import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './services/chat.service';
import { MessageService } from './services/message.service';
import { SessionService } from './services/session.service';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { Session } from '../sessions/entities/session.entity';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';
import { SessionRepository } from './repositories/session.repository';
import { ChatController } from './controllers/chat.controller';
import { MessageController } from './controllers/message.controller';
import { CommonModule } from '../../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenValidationGuard } from '../../common/guards/token-validation.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LLMFacade } from '../llm/facades/llm.facade';
import { LLMFactoryService } from '../llm/factories/llm-service.factory';
import { LLMContext } from '../llm/strategies/llm-context.strategy';
import { GPTAdapter } from '../llm/adapters/gpt.adapter';
import { ClaudeAdapter } from '../llm/adapters/claude.adapter';

@Module({
  controllers: [ChatController, MessageController],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60d' },
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    TypeOrmModule.forFeature([Chat, Message, Session]),
  ],
  providers: [
    GPTAdapter,
    ClaudeAdapter,
    LLMContext,
    LLMFacade,
    LLMFactoryService,
    TokenValidationGuard,
    ChatService,
    MessageService,
    SessionService,
    ChatRepository,
    MessageRepository,
    SessionRepository
  ],
  exports: [
    ChatService,
    MessageService,
    SessionService,
    LLMFacade,
    TokenValidationGuard
  ],
})
export class ChatModule {}