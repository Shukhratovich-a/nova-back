import { IsEnum, IsString } from "class-validator";

import { LanguageEnum } from "@enums/language.enum";

export class CreateCatalogDto {
  @IsString()
  poster: string;

  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  catalog: string;

  @IsString()
  year: string;

  @IsEnum(LanguageEnum)
  language: LanguageEnum;
}
