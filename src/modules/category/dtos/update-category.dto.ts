import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
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
}
