// src/common/services/llm-reliable.service.ts

import { Injectable } from '@nestjs/common';
import { LLMService } from '../interfaces/llm-service.interface';
import * as CircuitBreaker from 'opossum';

@Injectable()
export class LLMReliableService {
  private circuitBreaker: CircuitBreaker;

  constructor(private readonly llmService: LLMService) {
    this.circuitBreaker = new CircuitBreaker(this.llmService.generateText.bind(this.llmService), {
      timeout: 5000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    });
  }

  async generateTextWithRetry(prompt: string): Promise<string> {
    return await this.circuitBreaker.fire(prompt);
  }
}
