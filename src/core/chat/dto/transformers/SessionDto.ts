import { Expose, Type } from 'class-transformer';
import { SessionTranslationDto } from './SessionTranslationDto';

export class SessionDto {
  @Expose()
  id: number;
  
  @Expose()
  title: string;
  
  @Expose()
  text: string;

  @Expose()
  @Type(() => SessionTranslationDto)
  translations: SessionTranslationDto[];
}