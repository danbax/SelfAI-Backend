import { Expose, Type } from 'class-transformer';

export class SessionTranslationDto {
  @Expose()
  title: string;

  @Expose()
  text: string;
}