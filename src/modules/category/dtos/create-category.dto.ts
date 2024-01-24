import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { LanguageEnum } from "@enums/language.enum";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  poster: string;

  @IsString()
  @IsNotEmpty()
  alias: string;
}

export class CreateCategoryContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(LanguageEnum)
  @IsNotEmpty()
  language: LanguageEnum;
}
