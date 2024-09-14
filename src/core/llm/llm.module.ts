// src/core/llm/llm.module.ts

import { Module } from '@nestjs/common';
import { GPTAdapter } from './adapters/gpt.adapter';
import { ClaudeAdapter } from './adapters/claude.adapter';
import { LLMFactoryService } from './factories/llm-service.factory';
import { LLMFacade } from './facades/llm.facade';
import { CommandExecutor } from './commands/command-executor';
import { LLMContext } from './strategies/llm-context.strategy';
import { LLMController } from './controllers/llm.controller';

@Module({
  imports: [],
  controllers: [LLMController],
  providers: [
    GPTAdapter,
    ClaudeAdapter,
    LLMFactoryService,
    LLMFacade,
    CommandExecutor,
    LLMContext,
  ],
  exports: [
    LLMFacade,
    LLMFactoryService,
    GPTAdapter,
    ClaudeAdapter,
    LLMContext,
  ],
})
export class LLMModule {}
