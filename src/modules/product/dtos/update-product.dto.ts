import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

import { StatusEnum } from "@enums/status.enum";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsNumber()
  @IsOptional()
  subcategoryId?: number;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}

export class UpdateProductContentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProductImageDto {
  @IsString()
  @IsOptional()
  jpgPath?: string;

  @IsString()
  @IsOptional()
  webpPath?: string;
}
