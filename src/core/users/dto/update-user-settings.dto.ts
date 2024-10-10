// src/core/users/dto/update-user-settings.dto.ts
import { IsString, IsOptional, IsISO8601, IsBoolean, IsDate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @ValidateIf((o) => o.birthDate !== undefined)
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;

  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @IsOptional()
  @IsString()
  pinCode?: string;
}