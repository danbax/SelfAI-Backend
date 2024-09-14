// src/events/dispatchers/llm.event.dispatcher.ts

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LLMEventDispatcher {
  constructor(private eventEmitter: EventEmitter2) {}

  emitLLMRequest(prompt: string) {
    this.eventEmitter.emit('llm.request', { prompt });
  }
}
