import { IsEnum, IsOptional, IsString } from "class-validator";

import { StatusEnum } from "@enums/status.enum";

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  poster?: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}

export class UpdateCategoryContentDto {
  @IsString()
  title: string;
}
