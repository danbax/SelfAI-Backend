import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { SessionTranslation } from './session-translation.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'system_prompt' })
  systemPrompt: string;

  @ManyToOne(() => Category, (category) => category.sessions)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => SessionTranslation, (translation) => translation.session, { cascade: true })
  translations: SessionTranslation[];
}