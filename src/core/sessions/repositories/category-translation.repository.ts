import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryTranslation } from '../entities/category-translation.entity';

@Injectable()
export class CategoryTranslationRepository {
  constructor(
    @InjectRepository(CategoryTranslation)
    private readonly categoryTranslationRepository: Repository<CategoryTranslation>,
  ) {}

  async findByLanguageOrDefault(languageCode: string): Promise<CategoryTranslation[]> {
    return this.categoryTranslationRepository
      .createQueryBuilder('categoryTranslation')
      .where('categoryTranslation.languageCode = :languageCode', {
        languageCode
      })
      .getMany();
  }

  async findByCategoryIdAndLanguage(categoryId: number, languageCode: string = 'english'): Promise<CategoryTranslation[]> {
    return this.categoryTranslationRepository
      .createQueryBuilder('categoryTranslation')
      .where('categoryTranslation.categoryId = :categoryId', { categoryId })
      .andWhere('categoryTranslation.languageCode = :languageCode', {
        languageCode
      })
      .getMany();
  }
}
