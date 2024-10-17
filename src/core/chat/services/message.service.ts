import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/common/services/cache.service';
import { LLMMessageDto, LLMRequestDto } from '../../llm/dto/llm-request.dto';
import { ChatService } from './chat.service';
import { LLMFacade } from 'src/core/llm/facades/llm.facade';
import { LLMResponseClientDto, LLMResponseClientDtoPayloadAction, LLMResponseDto } from 'src/core/llm/dto/llm-response.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Chat } from '../entities/chat.entity';
import { camelCaseToDotSeparated, isValidJson } from '../../../common/utils/utility';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly chatService: ChatService,
    private readonly cacheService: CacheService,
    private readonly llmFacade: LLMFacade,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('chat.created')
  async handleChatCreated(chat: Chat): Promise<void> {
    await this.addAssistantMessageToChat(chat.id, chat.userId);
  }

  async addMessage(createMessageDto: CreateMessageDto, userId: number): Promise<LLMResponseClientDto> {
    await this.addUserMessageToChat(createMessageDto);
    const chatMessages = await this.getChatMessagesWithNewMessage(createMessageDto);
    const llmResponse = await this.generateLLMResponse(chatMessages);
    return this.processAndAddAssistantResponse(llmResponse, createMessageDto.chat_id, userId);
  }

  async updateMessage(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.findMessageById(id);
    if (!message) return null;
    return this.updateAndSaveMessage(message, updateMessageDto);
  }

  async deleteMessage(id: number): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) return;
  }

  private async addAssistantMessageToChat(chatId: number, userId: number): Promise<LLMResponseClientDto> {
    const chatMessages = await this.chatService.getChatMessages(chatId);
    const llmResponse = await this.generateLLMResponse(chatMessages);
    return this.processAndAddAssistantResponse(llmResponse, chatId, userId);
  }

  private async addUserMessageToChat(createMessageDto: CreateMessageDto): Promise<void> {
    await this.chatService.addMessageToChat(createMessageDto);
  }

  private async getChatMessagesWithNewMessage(createMessageDto: CreateMessageDto): Promise<LLMMessageDto[]> {
    const chatMessages = await this.chatService.getChatMessages(createMessageDto.chat_id);
    const newMessage: LLMMessageDto = {
      role: createMessageDto.role as 'user' | 'system' | 'assistant',
      content: createMessageDto.message,
    };
    chatMessages.push(newMessage);

    const cacheKey = `chat_messages_${createMessageDto.chat_id}`;
    await this.cacheService.set(cacheKey, chatMessages);

    return chatMessages;
  }

  private async generateLLMResponse(chatMessages: LLMMessageDto[]): Promise<LLMResponseDto> {
    const llmRequestDto: LLMRequestDto = {
      model: 'gpt',
      version: 'gpt-4o-mini',
      messages: chatMessages,
      maxTokens: null,
    };
    return this.llmFacade.generateText(llmRequestDto);
  }

  private async processAndAddAssistantResponse(response: LLMResponseDto, chatId: number, userId: number): Promise<LLMResponseClientDto> {
    const createAssistantMessageDto: CreateMessageDto = {
      chat_id: chatId,
      role: 'assistant',
      message: null,
    };

    return this.processResponse(response, userId, createAssistantMessageDto);
  }

  private async processResponse(response: LLMResponseDto, userId: number, createMessageDto: CreateMessageDto): Promise<LLMResponseClientDto> {
    if (response.text) {
      return this.handlePlainTextResponse(response.text, createMessageDto);
    }
    
    return this.handleJsonResponse(response.actions, userId, createMessageDto);
  }

  private async handlePlainTextResponse(text: string, createMessageDto: CreateMessageDto): Promise<LLMResponseClientDto> {
    createMessageDto.message = text;
    await this.chatService.addMessageToChat(createMessageDto);
    return { text };
  }

  private async handleJsonResponse(actions: any[], userId: number, createMessageDto: CreateMessageDto): Promise<LLMResponseClientDto> {
    for(let action of actions) {
      const dotSeperatedName = camelCaseToDotSeparated(action.name);

      const payload= {
        ...action,
        userId,
      }
  
      this.eventEmitter.emitAsync(dotSeperatedName, payload);
    }
    
    return { actions };
  }

  private async findMessageById(id: number): Promise<Message | null> {
    return this.messageRepository.findOne({ where: { id } });
  }

  private async updateAndSaveMessage(message: Message, updateMessageDto: UpdateMessageDto): Promise<Message> {
    Object.assign(message, updateMessageDto);
    return this.messageRepository.save(message);
  }
}