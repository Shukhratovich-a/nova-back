import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateDetailCategoryDto {
  @IsString()
  titleRu: string;

  @IsString()
  titleEn: string;

  @IsString()
  titleTr: string;

  @IsString()
  titleAr: string;
}

export class CreateDetailTypeDto {
  @IsString()
  titleRu: string;

  @IsString()
  titleEn: string;

  @IsString()
  titleTr: string;

  @IsString()
  titleAr: string;
}

export class CreateDetailDto {
  @IsString()
  value: string;

  @IsOptional()
  @IsNumber()
  typeId?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  order: number;

  @IsNumber()
  @IsOptional()
  productId?: number;
}
