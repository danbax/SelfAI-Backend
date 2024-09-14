// src/core/llm/llm.facade.ts

import { Injectable } from '@nestjs/common';
import { LLMContext } from '../strategies/llm-context.strategy';
import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMFactoryService } from '../factories/llm-service.factory';
import { LLMResponseDto } from '../dto/llm-response.dto';

@Injectable()
export class LLMFacade {
  constructor(
    private readonly llmFactoryService: LLMFactoryService,
    private readonly llmContext: LLMContext
  ) {}

  async generateText(request: LLMRequestDto): Promise<LLMResponseDto> {
    const adapter = this.llmFactoryService.getLLMAdapter(request);
    this.llmContext.setStrategy(adapter);

    return this.llmContext.generateText(request);
  }
}
