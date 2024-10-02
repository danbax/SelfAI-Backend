import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LLMEventDispatcher {
  constructor(private eventEmitter: EventEmitter2) {}

  emitEvent(action: string, parameters: any) {
    this.eventEmitter.emit(action, parameters);
  }
}
