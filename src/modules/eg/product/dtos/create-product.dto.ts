import { IsNumber, IsString, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CreateDetailDto } from "@modules/eg/detail/dtos/create-detail.dto";

export class CreateProductDto {
  @IsString()
  code: string;

  @IsNumber()
  subcategoryId: number;

  @IsString()
  @IsOptional()
  titleRu: string;

  @IsString()
  @IsOptional()
  titleEn: string;

  @IsString()
  @IsOptional()
  titleTr: string;

  @IsString()
  @IsOptional()
  titleAr: string;

  @IsString()
  @IsOptional()
  descriptionRu: string;

  @IsString()
  @IsOptional()
  descriptionEn: string;

  @IsString()
  @IsOptional()
  descriptionTr: string;

  @IsString()
  @IsOptional()
  descriptionAr: string;

  @IsString()
  @IsOptional()
  mainImage: string;

  @IsString()
  @IsOptional()
  boxImage: string;

  @IsString()
  @IsOptional()
  schemeImage: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateDetailDto)
  details?: CreateDetailDto[];
}
