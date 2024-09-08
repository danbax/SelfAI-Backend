import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventDispatcher {
  constructor(private eventEmitter: EventEmitter2) {}

  dispatch(event: string, payload: any) {
    this.eventEmitter.emit(event, payload);
  }
}
