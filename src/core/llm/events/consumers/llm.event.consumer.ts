// src/events/consumers/llm.event.consumer.ts

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GPTAdapter } from '../../adapters/gpt.adapter';
import { LLMRequestDto } from '../../dto/llm-request.dto';

@Injectable()
export class LLMEventConsumer {
  constructor(private readonly gptAdapter: GPTAdapter) {}

  @OnEvent('llm.request')
  async handleLLMRequest(payload: LLMRequestDto) {
    const response = await this.gptAdapter.generateText(payload);
    console.log(response);
  }
}
