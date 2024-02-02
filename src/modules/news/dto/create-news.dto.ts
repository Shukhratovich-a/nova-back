import { IsEnum, IsOptional, IsString } from "class-validator";

import { NewsTypeEnum } from "@enums/news-type.enum";
import { LanguageEnum } from "@enums/language.enum";

export class CreateNewsDto {
  @IsString()
  @IsOptional()
  alias?: string;

  @IsString()
  poster: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(NewsTypeEnum)
  @IsOptional()
  type?: NewsTypeEnum;
}

export class CreateNewsContentDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  body: string;

  @IsString()
  tag: string;

  @IsEnum(LanguageEnum)
  language: LanguageEnum;
}
