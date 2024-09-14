// src/common/commands/command-executor.ts

import { Injectable } from '@nestjs/common';
import { LLMCommand } from './llm.command.interface';

@Injectable()
export class CommandExecutor {
  async runCommand(command: LLMCommand): Promise<void> {
    await command.execute();
  }
}
