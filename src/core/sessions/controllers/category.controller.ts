// category.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { GetCategoriesDto } from '../dto/get-categories.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async getCategories(@Body() body: GetCategoriesDto) {
    return this.categoryService.getCategories(body);
  }
}
