import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/common/services/cache.service';
import { LLMMessageDto, LLMRequestDto } from '../../llm/dto/llm-request.dto';
import { ChatService } from './chat.service';
import { LLMFacade } from 'src/core/llm/facades/llm.facade';
import { LLMResponseClientDto, LLMResponseDto } from 'src/core/llm/dto/llm-response.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Chat } from '../entities/chat.entity';

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
    await this.addAssistantMessageToChat(chat.id);
  }

  async addMessage(createMessageDto: CreateMessageDto): Promise<LLMResponseClientDto> {
    await this.addUserMessageToChat(createMessageDto);
    const chatMessages = await this.getChatMessagesWithNewMessage(createMessageDto);
    const llmResponse = await this.generateLLMResponse(chatMessages);
    return this.processAndAddAssistantResponse(llmResponse, createMessageDto.chat_id);
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

  private async addAssistantMessageToChat(chatId: number): Promise<LLMResponseClientDto> {
    const chatMessages = await this.chatService.getChatMessages(chatId);
    const llmResponse = await this.generateLLMResponse(chatMessages);
    return this.processAndAddAssistantResponse(llmResponse, chatId);
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
      version: 'gpt-4o',
      messages: chatMessages,
      maxTokens: null,
    };
    return this.llmFacade.generateText(llmRequestDto);
  }

  private async processAndAddAssistantResponse(response: LLMResponseDto, chatId: number): Promise<LLMResponseClientDto> {
    const createAssistantMessageDto: CreateMessageDto = {
      chat_id: chatId,
      role: 'assistant',
      message: null,
    };

    return this.processResponse(response.text, createAssistantMessageDto);
  }

  private async processResponse(text: string, createMessageDto: CreateMessageDto): Promise<LLMResponseClientDto> {
    if (!this.isValidJson(text)) {
      return this.handlePlainTextResponse(text, createMessageDto);
    }
    return this.handleJsonResponse(text, createMessageDto);
  }

  private async handlePlainTextResponse(text: string, createMessageDto: CreateMessageDto): Promise<LLMResponseClientDto> {
    createMessageDto.message = text;
    await this.chatService.addMessageToChat(createMessageDto);
    return { text };
  }

  private async handleJsonResponse(text: string, createMessageDto: CreateMessageDto): Promise<LLMResponseClientDto> {
    const data = JSON.parse(text);
    const { text: responseText, payload } = data;

    createMessageDto.message = responseText;
    await this.chatService.addMessageToChat(createMessageDto);

    await this.emitActions(payload.actions);

    return { text: responseText, payload };
  }

  private async emitActions(actions: any[]): Promise<void> {
    for (const action of actions) {
      await this.eventEmitter.emitAsync(action.name, ...action.parameters);
    }
  }

  private isValidJson(text: string): boolean {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  }

  private async findMessageById(id: number): Promise<Message | null> {
    return this.messageRepository.findOne({ where: { id } });
  }

  private async updateAndSaveMessage(message: Message, updateMessageDto: UpdateMessageDto): Promise<Message> {
    Object.assign(message, updateMessageDto);
    return this.messageRepository.save(message);
  }
}