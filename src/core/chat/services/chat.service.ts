// chat.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateChatDto } from '../dto/create-chat.dto';
import { Chat } from '../entities/chat.entity';
import { IChatService } from '../interfaces/chat.interface';
import { CacheService } from '../../../common/services/cache.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private readonly cacheService: CacheService
  ) {}

  async getChatWithMessages(chatId: number): Promise<Chat | null> {
    const cacheKey = `chat_${chatId}`;
    const cachedChat = this.cacheService.get<Chat>(cacheKey);

    if (cachedChat) return cachedChat;

    const chat = await this.chatRepository.findOne({ 
      where: { id: chatId }, 
      relations: ['messages'] 
    });

    if (!chat) return null;

    this.cacheService.set(cacheKey, chat);

    return chat;
  }

  async getAllChats(userId: number, finished?: boolean): Promise<Chat[]> {
    const cacheKey = `chats_${userId}_${finished}`;
    const cachedChats = this.cacheService.get<Chat[]>(cacheKey);

    if (cachedChats) return cachedChats;

    const whereClause: any = { userId: userId, finished: finished };

    if (finished === undefined) {
      delete whereClause.finished;
    }

    const chats = await this.chatRepository.find({ where: whereClause });

    this.cacheService.set(cacheKey, chats);

    return chats;
  }

  async createNewChat(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = this.chatRepository.create(createChatDto);
    return this.chatRepository.save(chat);
  }
}

