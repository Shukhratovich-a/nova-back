import { IsString, IsEnum, IsOptional } from "class-validator";

import { StatusEnum } from "@enums/status.enum";

export class UpdateTagDto {
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
