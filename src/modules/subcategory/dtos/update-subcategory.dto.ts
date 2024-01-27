import { IsEnum, IsOptional, IsString } from "class-validator";

import { StatusEnum } from "@enums/status.enum";

export class UpdateSubcategoryDto {
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

export class UpdateSubcategoryContentDto {
  @IsString()
  title: string;
}
