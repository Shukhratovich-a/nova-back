import { IsEnum, IsNumber, IsString } from "class-validator";

import { LanguageEnum } from "@enums/language.enum";

export class CreateSubcategoryDto {
  @IsString()
  poster: string;

  // @IsString()
  // alias: string;

  @IsNumber()
  categoryId: number;
}

export class CreateSubcategoryContentDto {
  @IsString()
  title: string;

  @IsEnum(LanguageEnum)
  language: LanguageEnum;
}
