// src/core/llm/llm.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { LLMFacade } from '../facades/llm.facade';
import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMResponseDto } from '../dto/llm-response.dto';

@Controller('llm')
export class LLMController {
  constructor(private readonly llmFacade: LLMFacade) {}

  @Post('generate')
  async generateText(
    @Body() request: LLMRequestDto,
  ): Promise<LLMResponseDto> {
    return await this.llmFacade.generateText(request);
  }

  @Post('async-generate')
  async generateTextAsync(@Body() request: LLMRequestDto): Promise<LLMResponseDto> {
    return await this.llmFacade.generateText(request);
  }
}
