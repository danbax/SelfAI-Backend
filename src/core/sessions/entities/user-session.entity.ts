// src/core/user-sessions/entities/user-session.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Session } from './session.entity';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'session_id' })
  sessionId: number;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'session_id' })
  session: Session;
}