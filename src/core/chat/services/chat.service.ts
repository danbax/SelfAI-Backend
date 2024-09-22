// chat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateChatDto } from '../dto/create-chat.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { IChatService } from '../interfaces/chat.interface';
import { CacheService } from '../../../common/services/cache.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
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

    const whereClause: any = { userId };

    if (finished !== undefined) {
      whereClause.finished = finished;
    }

    const chats = await this.chatRepository.find({
      where: whereClause,
      relations: ['session', 'session.category'],
    });

    this.cacheService.set(cacheKey, chats);

    return chats;
  }

  async createNewChat(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = this.chatRepository.create(createChatDto);
    const savedChat = await this.chatRepository.save(chat);
  
    const cacheKey = `chats_${createChatDto.user_id}_${false}`;
    const cachedChats = await this.cacheService.get<Chat[]>(cacheKey);
  
    if (!cachedChats) {
      return savedChat;
    }
    
    const updatedChats = [...cachedChats, savedChat];
    this.cacheService.set(cacheKey, updatedChats);
  
    return savedChat;
  }

  async addMessageToChat(createMessageDto: CreateMessageDto): Promise<Message | null> {
    const chat = await this.chatRepository.findOne({ where: {
      id: createMessageDto.chat_id
    } });

    if (!chat) {
      throw new NotFoundException(`Chat not found`);

    }

    const messageCreated = this.messageRepository.create({
      chatId: createMessageDto.chat_id,
      message: createMessageDto.message,
      role: createMessageDto.role,
      createDate: new Date(),
      updateDate: new Date()
    });

    return await this.messageRepository.save(messageCreated);
  }
  
}

