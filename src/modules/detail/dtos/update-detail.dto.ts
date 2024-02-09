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
  valueEn?: string;

  @IsNumber()
  @IsOptional()
  valueRu?: string;

  @IsNumber()
  @IsOptional()
  valueTr?: string;

  @IsNumber()
  @IsOptional()
  valueAr?: string;

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
