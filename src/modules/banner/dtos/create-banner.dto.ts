import { IsEnum, IsOptional, IsString } from "class-validator";

import { LanguageEnum } from "@enums/language.enum";

export class CreateBannerDto {
  @IsString()
  poster: string;
}

export class CreateBannerContentDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsEnum(LanguageEnum)
  language: LanguageEnum;
}
