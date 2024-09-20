// src/core/sessions/entities/session.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { SessionTranslation } from './session-translation.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  categoryId: number;

  @Column('text')
  systemPrompt: string;

  /**
  @ManyToOne(() => Category, category => category.sessions)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => SessionTranslation, translation => translation.session)
  translations: SessionTranslation[];
   */
}