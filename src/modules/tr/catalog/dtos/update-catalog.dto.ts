import { IsOptional, IsString } from "class-validator";

export class UpdateCatalogDto {
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
  @IsString()
  @IsOptional()
  subtitleRu?: string;

  @IsString()
  @IsOptional()
  subtitleEn?: string;

  @IsString()
  @IsOptional()
  subtitleTr?: string;

  @IsString()
  @IsOptional()
  subtitleAr?: string;

  @IsString()
  @IsOptional()
  catalog?: string;

  @IsString()
  @IsOptional()
  year?: string;
}
