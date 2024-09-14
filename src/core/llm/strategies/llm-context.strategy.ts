// src/core/llm/strategies/llm-context.strategy.ts
import { Injectable } from '@nestjs/common';
import { LLMService } from '../interfaces/llm-service.interface';
import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMResponseDto } from '../dto/llm-response.dto';

@Injectable()
export class LLMContext {
  private strategy: LLMService;

  setStrategy(strategy: LLMService) {
    this.strategy = strategy;
  }

  async generateText(request: LLMRequestDto): Promise<LLMResponseDto> {
    if (!this.strategy) {
      throw new Error('No LLM strategy set');
    }

    return this.strategy.generateText(request);
  }
}
