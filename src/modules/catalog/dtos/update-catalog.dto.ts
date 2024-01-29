import { IsEnum, IsOptional, IsString } from "class-validator";

import { LanguageEnum } from "@/enums/language.enum";

export class UpdateCatalogDto {
  @IsString()
  @IsOptional()
  poster: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  subtitle: string;

  @IsString()
  @IsOptional()
  catalog: string;

  @IsString()
  @IsOptional()
  year: string;

  @IsEnum(LanguageEnum)
  @IsOptional()
  language: LanguageEnum;
}
