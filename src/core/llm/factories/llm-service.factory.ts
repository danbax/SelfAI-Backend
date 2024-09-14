// src/core/llm/factories/llm-factory.service.ts
import { Injectable } from '@nestjs/common';
import { GPTAdapter } from '../adapters/gpt.adapter';
import { ClaudeAdapter } from '../adapters/claude.adapter';
import { LLMService } from '../interfaces/llm-service.interface';
import { LLMRequestDto } from '../dto/llm-request.dto';

@Injectable()
export class LLMFactoryService {
  constructor(
    private readonly gptAdapter: GPTAdapter,
    private readonly claudeAdapter: ClaudeAdapter,
  ) {}

  getLLMAdapter(request: LLMRequestDto): LLMService {
    if (request.model === 'gpt') {
      return this.gptAdapter;
    }

    if (request.model === 'claude') {
      return this.claudeAdapter;
    }

    throw new Error('Model not supported');
  }
}
