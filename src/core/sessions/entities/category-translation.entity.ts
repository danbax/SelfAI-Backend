import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('categories_translations')
export class CategoryTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'category_id' })
  categoryId: number;

  @Column({ type: 'char', length: 11, name: 'language_code' })
  languageCode: string;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;
  
  /**
  @ManyToOne(() => Category, (category) => category.translations, { onDelete: 'CASCADE' })
  
  @JoinColumn({ name: 'category_id' })
  category: Category;
  **/
}
