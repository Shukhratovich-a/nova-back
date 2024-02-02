import { IsEnum, IsOptional, IsString } from "class-validator";

import { NewsTypeEnum } from "@enums/news-type.enum";
import { StatusEnum } from "@enums/status.enum";

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  poster?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(NewsTypeEnum)
  @IsOptional()
  type?: NewsTypeEnum;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}

export class UpdateNewsContentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  tag?: string;
}
