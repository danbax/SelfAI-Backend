// message.service.ts

import { Injectable } from '@nestjs/common';
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

  async addMessage(createMessageDto: Message): Promise<LLMResponseClientDto> {
    const message = this.messageRepository.create(createMessageDto);
    await this.messageRepository.save(message);

    const chatMessages = await this.chatService.getChatMessages(message.chatId);
    const newMessage: LLMMessageDto = {
      role: message.role as 'user' | 'system' | 'assistant',
      content: message.message,
    };
    chatMessages.push(newMessage);

    const cacheKey = `chat_messages_${createMessageDto.chatId}`;
    this.cacheService.set(cacheKey, chatMessages);

    const llmRequestDto: LLMRequestDto = {
      model: 'gpt',
      version: 'gpt-4o',
      messages: chatMessages,
      maxTokens: null,
    };

    const response: LLMResponseDto = await this.llmFacade.generateText(llmRequestDto);

    const responseClient = this.processResponse(response.text);

    return responseClient;
  }

  private async processResponse(text: string): Promise<LLMResponseClientDto> {
    if (!this.isValidJson(text)) {
      return { text };
    }

    const payload = JSON.parse(text);

    if (!payload.action) {
      return { text, payload };
    }

    this.eventEmitter.emitAsync(payload.action, ...payload.parameters);

    return { text };
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
