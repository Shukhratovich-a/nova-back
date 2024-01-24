import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { LanguageEnum } from "@enums/language.enum";

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  poster: string;
}

export class CreateBannerContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsEnum(LanguageEnum)
  @IsNotEmpty()
  language: LanguageEnum;
}
