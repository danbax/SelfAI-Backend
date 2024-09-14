export class ChatCreatedEvent {
    constructor(public readonly chatId: number) {}
  }
  
  export class MessageSentEvent {
    constructor(public readonly messageId: number) {}
  }
  