import { IsNumber, IsOptional, IsString } from "class-validator";

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

  @IsNumber()
  @IsOptional()
  categoryId: number;
}
