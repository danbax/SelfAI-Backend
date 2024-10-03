// message.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/common/services/cache.service';
import { LLMMessageDto, LLMRequestDto } from '../../llm/dto/llm-request.dto';
import { ChatService } from './chat.service';
import { LLMFacade } from 'src/core/llm/facades/llm.facade';
import { LLMResponseClientDto, LLMResponseDto } from 'src/core/llm/dto/llm-response.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { Chat } from '../entities/chat.entity';
import { CreateMessageDto } from '../dto/create-message.dto';

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

  async addMessage(createMessageDto: CreateMessageDto): Promise<LLMResponseClientDto> {
    this.chatService.addMessageToChat(createMessageDto);

    const chatMessages = await this.chatService.getChatMessages(createMessageDto.chat_id);
    const newMessage: LLMMessageDto = {
      role: createMessageDto.role as 'user' | 'system' | 'assistant',
      content: createMessageDto.message,
    };
    chatMessages.push(newMessage);

    const cacheKey = `chat_messages_${createMessageDto.chat_id}`;
    this.cacheService.set(cacheKey, chatMessages);

    const llmRequestDto: LLMRequestDto = {
      model: 'gpt',
      version: 'gpt-4o',
      messages: chatMessages,
      maxTokens: null,
    };

    const response: LLMResponseDto = await this.llmFacade.generateText(llmRequestDto);

    let createAssistantMessageDto: CreateMessageDto = {
      chat_id: createMessageDto.chat_id,
      role: 'assistant',
      message: null,
    };

    const responseClient = this.processResponse(response.text, createAssistantMessageDto);

    return responseClient;
  }

  private async processResponse(text: string, createMessageDto: CreateMessageDto): Promise<LLMResponseClientDto> {
    if (!this.isValidJson(text)) {
      createMessageDto.message = text;
      this.chatService.addMessageToChat(createMessageDto);
      return { text };
    }

    const data = JSON.parse(text);
    text = data.text;
    const payload = data.payload;

    createMessageDto.message = text;
    this.chatService.addMessageToChat(createMessageDto);

    for(const action of payload.actions) {
      this.eventEmitter.emitAsync(action.name, ...action.parameters);
    }

    return { text, payload };
  }

  private isValidJson(text: string): boolean {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  }

  async updateMessage(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) return null;
    Object.assign(message, updateMessageDto);
    return this.messageRepository.save(message);
  }

  async deleteMessage(id: number): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) return;
  }
}
