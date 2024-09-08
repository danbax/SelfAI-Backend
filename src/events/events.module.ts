import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventDispatcher } from './dispatchers/event.dispatcher';
import { EventConsumer } from './consumers/event.consumer';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EventDispatcher, EventConsumer],
})
export class EventsModule {}
