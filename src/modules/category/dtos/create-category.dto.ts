import { IsEnum, IsString } from "class-validator";

import { LanguageEnum } from "@enums/language.enum";

export class CreateCategoryDto {
  @IsString()
  poster: string;

  @IsString()
  alias: string;
}

export class CreateCategoryContentDto {
  @IsString()
  title: string;

  @IsEnum(LanguageEnum)
  language: LanguageEnum;
}
