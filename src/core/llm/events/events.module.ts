// src/events/events.module.ts

import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LLMEventDispatcher } from './dispatchers/llm.event.dispatcher';
import { LLMEventConsumer } from './consumers/llm.event.consumer';
import { LLMModule } from '../llm.module';

@Module({
  imports: [EventEmitterModule.forRoot(), LLMModule],
  providers: [LLMEventDispatcher, LLMEventConsumer],
  exports: [LLMEventDispatcher],
})
export class EventsModule {}
