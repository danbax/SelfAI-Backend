import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventConsumer implements OnModuleInit {
  constructor(private eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.eventEmitter.on('user.created', this.handleUserCreatedEvent);
  }

  handleUserCreatedEvent(payload: any) {
    console.log('User created event received:', payload);
  }
}
