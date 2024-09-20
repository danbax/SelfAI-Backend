import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryTranslationRepository } from '../repositories/category-translation.repository';
import { GetCategoriesDto } from '../dto/get-categories.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryTranslationRepository: CategoryTranslationRepository,
  ) {}

  async getCategories({ languageCode }: GetCategoriesDto) {
    const categories = await this.categoryTranslationRepository.findByLanguageOrDefault(languageCode);
    return categories;
  }
}
