import { IsString, IsNumber, IsOptional } from "class-validator";

export class UpdateDetailCategoryDto {
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
}

export class UpdateDetailTypeDto {
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
}

export class UpdateDetailDto {
  @IsNumber()
  @IsOptional()
  value?: string;

  @IsNumber()
  @IsOptional()
  typeId?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  productId?: number;
}
