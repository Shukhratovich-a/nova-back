import { Type } from "class-transformer";
import { IsString, IsOptional, IsEnum, IsArray, ValidateNested } from "class-validator";

import { NewsTypeEnum } from "@enums/news-type.enum";
import { StatusEnum } from "@enums/status.enum";

import { NewsTagDto } from "./news.dto";

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  poster?: string;

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

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NewsTagDto)
  tags: NewsTagDto[];
}
