import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAllWithTranslations(languageCode: string = 'english'): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation')
      .where('translation.languageCode = :languageCode OR translation.languageCode = :defaultLang', { 
        languageCode, 
        defaultLang: 'en' 
      })
      .getMany();
  }

  async findByIdWithTranslations(categoryId: number, languageCode: string = 'english'): Promise<Category> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('translation.languageCode = :languageCode OR translation.languageCode = :defaultLang', { 
        languageCode, 
        defaultLang: 'english' 
      })
      .getOne();
  }
}
