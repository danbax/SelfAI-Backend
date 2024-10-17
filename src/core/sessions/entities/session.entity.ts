// session.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CategoryTranslation } from './category-translation.entity';
import { SessionTranslation } from './session-translation.entity';
import { Chat } from '../../chat/entities/chat.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'system_prompt' })
  systemPrompt: string;


  @Column({ name: 'data_source' })
  dataSource: string;

  @ManyToOne(() => CategoryTranslation, (categoryTranslation) => categoryTranslation.sessions)
  @JoinColumn({ name: 'category_id' })
  category: CategoryTranslation;

  @OneToMany(() => SessionTranslation, (translation) => translation.session, { cascade: true })
  translations: SessionTranslation[];

  @OneToMany(() => Chat, chat => chat.session)
  chats: Chat[];
}