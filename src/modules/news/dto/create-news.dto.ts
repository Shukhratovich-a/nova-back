import { IsEnum, IsOptional, IsString } from "class-validator";

import { NewsTypeEnum } from "@enums/news-type.enum";

export class CreateNewsDto {
  @IsString()
  @IsOptional()
  alias?: string;

  @IsString()
  poster: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  titleRu?: string;

  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  @IsOptional()
  titleTr?: string;

  @IsString()
  @IsOptional()
  titleAr?: string;

  @IsString()
  @IsOptional()
  subtitleRu?: string;

  @IsString()
  @IsOptional()
  subtitleEn?: string;

  @IsString()
  @IsOptional()
  subtitleTr?: string;

  @IsString()
  @IsOptional()
  subtitleAr?: string;

  @IsString()
  @IsOptional()
  bodyRu?: string;

  @IsString()
  @IsOptional()
  bodyEn?: string;

  @IsString()
  @IsOptional()
  bodyTr?: string;

  @IsString()
  @IsOptional()
  bodyAr?: string;

  @IsEnum(NewsTypeEnum)
  @IsOptional()
  type?: NewsTypeEnum;
}
