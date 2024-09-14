// src/common/commands/gpt.command.ts

import { LLMCommand } from './llm.command.interface';
import { GPTAdapter } from '../adapters/gpt.adapter';
import { LLMRequestDto } from '../dto/llm-request.dto';

export class GPTCommand implements LLMCommand {
  constructor(private gptService: GPTAdapter, private request: LLMRequestDto) {}

  async execute(): Promise<void> {
    const response = await this.gptService.generateText(this.request);
    // TODO: Handle the response as needed
  }
}
