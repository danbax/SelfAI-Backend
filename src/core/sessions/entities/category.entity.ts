// category.entity.ts
import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CategoryTranslation } from './category-translation.entity';
import { Session } from './session.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CategoryTranslation, (translation) => translation.category, { cascade: true })
  translations: CategoryTranslation[];

  @OneToMany(() => Session, (session) => session.category)
  sessions: Session[];
}