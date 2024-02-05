import { IsEnum, IsOptional, IsString } from "class-validator";

import { StatusEnum } from "@enums/status.enum";

export class UpdateSubcategoryDto {
  @IsString()
  @IsOptional()
  poster?: string;

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

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
