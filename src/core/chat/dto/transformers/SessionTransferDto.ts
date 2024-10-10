import { Expose, Type } from 'class-transformer';
import { CategoryDto } from './CategoryDto';
import { SessionDto } from './SessionDto';

export class SessionTransferDto {
  @Expose()
  id: number;

  @Expose()
  createDate: Date;

  @Expose()
  finished: boolean;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @Expose()
  @Type(() => SessionDto)
  session: SessionDto;
}