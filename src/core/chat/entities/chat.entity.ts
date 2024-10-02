// src/core/chat/entities/chat.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Message } from './message.entity';
import { SessionTranslation } from '../../sessions/entities/session-translation.entity';
import { Session } from '../../sessions/entities/session.entity';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'session_id' })
  sessionId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];

  @Column()
  finished: boolean;

  @ManyToOne(() => SessionTranslation, sessionTranslation => sessionTranslation.chats)
  @JoinColumn({ name: 'session_id' })
  sessionTranslation: SessionTranslation;

  @ManyToOne(() => Session, session => session.chats)
  @JoinColumn({ name: 'session_id' })
  session: Session;
}