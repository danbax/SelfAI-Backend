// get-categories.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class GetCategoriesDto {
  @IsOptional()
  @IsString()
  languageCode?: string = 'english';
}
