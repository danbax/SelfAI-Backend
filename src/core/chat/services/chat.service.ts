import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { Session } from '../../sessions/entities/session.entity';
import { CacheService } from '../../../common/services/cache.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { SessionTransferDto } from '../dto/transformers/SessionTransferDto';
import { PaginationDTO } from '../../../common/dto/pagination.dto';
import { ChatWithMessagesDto } from '../dto/transformers/ChatWithMessagesDTO';
import { LLMMessageDto } from 'src/core/llm/dto/llm-request.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
    private readonly eventEmitter: EventEmitter2,
    private readonly cacheService: CacheService
  ) {}

  async getChatMessages(chatId: number): Promise<LLMMessageDto[] | null> {
    const cacheKey = this.getChatMessagesCacheKey(chatId);
    const cachedMessages = this.cacheService.get<LLMMessageDto[]>(cacheKey);
  
    if (cachedMessages) return cachedMessages;
  
    const chat = await this.fetchChatWithMessages(chatId);
    if (!chat) return null;
  
    const formattedMessages = this.formatMessages(chat.messages);
    this.cacheService.set(cacheKey, formattedMessages);
  
    return formattedMessages;
  }

  async getChatWithMessages(chatId: number, languageCode: string = 'english'): Promise<ChatWithMessagesDto | null> {
    const cacheKey = this.getChatWithMessagesCacheKey(chatId);
    const cachedChat = this.cacheService.get<ChatWithMessagesDto>(cacheKey);

    if (cachedChat) return cachedChat;

    const chat = await this.fetchChatWithMessagesAndSession(chatId, languageCode);
    if (!chat) return null;

    const chatWithMessages = this.createChatWithMessagesDto(chat, languageCode);
    this.cacheService.set(cacheKey, chatWithMessages);

    return chatWithMessages;
  }

  async getAllChats(
    userId: number,
    paginationDto: PaginationDTO,
    search?: string,
    finished?: boolean
  ): Promise<{ chats: SessionTransferDto[], total: number }> {
    const cacheKey = this.getAllChatsCacheKey(userId, paginationDto, search, finished);
    const cachedResult = this.cacheService.get<{ chats: SessionTransferDto[], total: number }>(cacheKey);

    if (cachedResult) return cachedResult;

    const queryBuilder = this.createAllChatsQueryBuilder(userId, search, finished);
    const [chats, total] = await this.executePaginatedQuery(queryBuilder, paginationDto);

    const transformedChats = this.transformChatsToSessionTransferDto(chats);
    const result = { chats: transformedChats, total };
    this.cacheService.set(cacheKey, result);

    return result;
  }

  async createNewChat(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = this.chatRepository.create(createChatDto);
    const savedChat = await this.chatRepository.save(chat);
  
    await this.updateChatCache(savedChat, createChatDto.userId);
    await this.addSystemPromptMessage(savedChat.id, createChatDto.sessionId);
    this.eventEmitter.emit('chat.created', savedChat);
  
    return savedChat;
  }

  async addMessageToChat(createMessageDto: CreateMessageDto): Promise<Message> {
    const chat = await this.chatRepository.findOne({ 
      where: { id: createMessageDto.chat_id }
    });

    if (!chat) {
      throw new NotFoundException(`Chat with id ${createMessageDto.chat_id} not found`);
    }

    const message = this.createMessage(createMessageDto);
    await this.updateChatMessagesCache(createMessageDto.chat_id, message);

    return await this.messageRepository.save(message);
  }

  private getChatMessagesCacheKey(chatId: number): string {
    return `chat_messages_${chatId}`;
  }

  private getChatWithMessagesCacheKey(chatId: number): string {
    return `chat_${chatId}`;
  }

  private getAllChatsCacheKey(userId: number, paginationDto: PaginationDTO, search?: string, finished?: boolean): string {
    const { page, limit } = paginationDto;
    return `chats_${userId}_${finished}_${search}_${page}_${limit}`;
  }

  private async fetchChatWithMessages(chatId: number): Promise<Chat | null> {
    return this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'messages')
      .where('chat.id = :chatId', { chatId })
      .orderBy('messages.id', 'ASC')
      .getOne();
  }

  private formatMessages(messages: Message[]): LLMMessageDto[] {
    return messages.map(message => ({
      role: message.role,
      content: message.message
    }));
  }

  private async fetchChatWithMessagesAndSession(chatId: number, languageCode: string): Promise<Chat | null> {
    return this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'messages', 'messages.role != :systemRole')
      .leftJoinAndSelect('chat.session', 'session')
      .leftJoinAndSelect('session.translations', 'translations', 'translations.languageCode = :languageCode')
      .where('chat.id = :chatId', { chatId })
      .setParameter('languageCode', languageCode)
      .setParameter('systemRole', 'system')
      .getOne();
  }

  private createChatWithMessagesDto(chat: Chat, languageCode: string): ChatWithMessagesDto {
    const translation = chat.session.translations[0];
    return new ChatWithMessagesDto({
      id: chat.id,
      userId: chat.userId,
      createDate: chat.createDate,
      finished: chat.finished,
      messages: chat.messages,
      session: {
        id: chat.session.id,
        title: translation ? translation.title : ''
      }
    });
  }

  private createAllChatsQueryBuilder(userId: number, search?: string, finished?: boolean) {
    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.session', 'session')
      .leftJoinAndSelect('session.category', 'category')
      .leftJoinAndSelect('session.translations', 'translation', 'translation.language_code = :langCode')
      .where('chat.userId = :userId', { userId });

    if (search) {
      queryBuilder.andWhere('(LOWER(translation.title) LIKE LOWER(:search) OR LOWER(translation.text) LIKE LOWER(:search))', 
        { search: `%${search}%` }
      );
    }

    return queryBuilder;
  }

  private async executePaginatedQuery(queryBuilder: any, paginationDto: PaginationDTO) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    return queryBuilder
      .orderBy('chat.createDate', 'DESC')
      .skip(skip)
      .take(limit)
      .setParameter('langCode', 'english')
      .getManyAndCount();
  }

  private transformChatsToSessionTransferDto(chats: Chat[]): SessionTransferDto[] {
    return chats.map(chat => {
      const firstTranslation = chat.session.translations[0] || { title: '', text: '' };
      return plainToClass(SessionTransferDto, {
        id: chat.id,
        createDate: chat.createDate,
        finished: chat.finished,
        category: {
          id: chat.session.category.id,
          name: chat.session.category.name,
          icon: chat.session.category.icon,
        },
        session: {
          id: chat.session.id,
          title: firstTranslation.title || '',
          text: firstTranslation.text || '',
        },
      }, { excludeExtraneousValues: true });
    });
  }

  private async updateChatCache(savedChat: Chat, userId: number) {
    const cacheKey = `chats_${userId}_${false}`;
    const cachedChats = await this.cacheService.get<Chat[]>(cacheKey);
  
    let updatedChats: Chat[];
    if (!cachedChats) {
      updatedChats = [savedChat];
    } else {
      updatedChats = [...cachedChats, savedChat];
    }
    await this.cacheService.set(cacheKey, updatedChats);
  }

  private async addSystemPromptMessage(chatId: number, sessionId: number) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      select: ['systemPrompt'],
    });    

    const systemPrompt = session?.systemPrompt;
  
    await this.addMessageToChat({
      chat_id: chatId,
      role: 'system',
      message: systemPrompt
    });
  }

  private createMessage(createMessageDto: CreateMessageDto): Message {
    return this.messageRepository.create({
      chatId: createMessageDto.chat_id,
      message: createMessageDto.message,
      role: createMessageDto.role,
      createDate: new Date(),
      updateDate: new Date()
    });
  }

  private async updateChatMessagesCache(chatId: number, message: Message) {
    const cacheKey = `chat_${chatId}`;
    const cachedChat = this.cacheService.get<ChatWithMessagesDto>(cacheKey);
    
    if (cachedChat) {
      cachedChat.messages.push(message);
      this.cacheService.set(cacheKey, cachedChat);
    }
  }
}