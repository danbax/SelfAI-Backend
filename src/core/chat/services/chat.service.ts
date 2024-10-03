import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { Session } from '../entities/session.entity';
import { CacheService } from '../../../common/services/cache.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { SessionTransferDto } from '../dto/transformers/SessionTransferDto';
import { PaginationDTO } from '../../../common/dto/pagination.dto';
import { ChatWithMessagesDto } from '../dto/transformers/ChatWithMessagesDTO';
import { LLMMessageDto } from 'src/core/llm/dto/llm-request.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
    private readonly cacheService: CacheService
  ) {}

  async getChatMessages(chatId: number): Promise<LLMMessageDto[] | null> {
    const cacheKey = `chat_messages_${chatId}`;
    const cachedMessages = this.cacheService.get<LLMMessageDto[]>(cacheKey);
  
    if (cachedMessages) return cachedMessages;
  
    const chat = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'messages')
      .where('chat.id = :chatId', { chatId })
      .orderBy('messages.id', 'ASC')
      .getOne();
  
    if (!chat) return null;
  
    const formattedMessages = chat.messages.map(message => ({
      role: message.role,
      content: message.message
    }));
  
    this.cacheService.set(cacheKey, formattedMessages);
  
    return formattedMessages;
  }

  async getChatWithMessages(chatId: number, languageCode: string = 'english'): Promise<ChatWithMessagesDto | null> {
    const cacheKey = `chat_${chatId}`;
    const cachedChat = this.cacheService.get<ChatWithMessagesDto>(cacheKey);

    if (cachedChat) return cachedChat;

    const chat = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'messages', 'messages.role != :systemRole')
      .leftJoinAndSelect('chat.session', 'session')
      .leftJoinAndSelect('session.translations', 'translations', 'translations.languageCode = :languageCode')
      .where('chat.id = :chatId', { chatId })
      .setParameter('languageCode', languageCode)
      .setParameter('systemRole', 'system')
      .getOne();


    if (!chat) return null;

    const translation = chat.session.translations[0];

    const chatWithMessages = new ChatWithMessagesDto({
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

    this.cacheService.set(cacheKey, chatWithMessages);

    return chatWithMessages;
  }

  async getAllChats(
    userId: number,
    paginationDto: PaginationDTO,
    search?: string,
    finished?: boolean
  ): Promise<{ chats: SessionTransferDto[], total: number }> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const cacheKey = `chats_${userId}_${finished}_${search}_${page}_${limit}`;
    const cachedResult = this.cacheService.get<{ chats: SessionTransferDto[], total: number }>(cacheKey);

    if (cachedResult) return cachedResult;

    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.session', 'session')
      .leftJoinAndSelect('session.category', 'category')
      .leftJoinAndSelect('session.translations', 'translation', 'translation.language_code = :langCode')
      .where('chat.userId = :userId', { userId });

      /** 
    if (finished !== undefined) {
      queryBuilder.andWhere('chat.finished = :finished', { finished });
    }
*/

    if (search) {
      queryBuilder.andWhere('(LOWER(translation.title) LIKE LOWER(:search) OR LOWER(translation.text) LIKE LOWER(:search))', 
        { search: `%${search}%` }
      );
    }

    const [chats, total] = await queryBuilder
      .orderBy('chat.createDate', 'DESC')
      .skip(skip)
      .take(limit)
      .setParameter('langCode', 'english')
      .getManyAndCount();

    const transformedChats = chats.map(chat => {
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

    const result = { chats: transformedChats, total };
    this.cacheService.set(cacheKey, result);

    return result;
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

    const session = await this.sessionRepository.findOne({
      where: { id: createChatDto.session_id },
      select: ['systemPrompt'],
    });    

    const systemPrompt = session?.systemPrompt;

    this.addMessageToChat({
      chat_id: savedChat.id,
      role: 'system',
      message: systemPrompt
    });

    return savedChat;
  }

  async addMessageToChat(createMessageDto: CreateMessageDto): Promise<Message> {
    const chat = await this.chatRepository.findOne({ 
      where: { id: createMessageDto.chat_id }
    });

    if (!chat) {
      throw new NotFoundException(`Chat with id ${createMessageDto.chat_id} not found`);
    }

    const message = this.messageRepository.create({
      chatId: createMessageDto.chat_id,
      message: createMessageDto.message,
      role: createMessageDto.role,
      createDate: new Date(),
      updateDate: new Date()
    });

    const cacheKey = `chat_${createMessageDto.chat_id}`;
    const cachedChat = this.cacheService.get<ChatWithMessagesDto>(cacheKey);
    
    if (cachedChat) {
      cachedChat.messages.push(message);
      this.cacheService.set(cacheKey, cachedChat);
    }

    return await this.messageRepository.save(message);
  }
}