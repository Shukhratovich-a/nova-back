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
  valueEn: string;

  @IsString()
  valueRu: string;

  @IsString()
  valueTr: string;

  @IsString()
  valueAr: string;

  @IsOptional()
  @IsNumber()
  typeId?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  productId?: number;
}
