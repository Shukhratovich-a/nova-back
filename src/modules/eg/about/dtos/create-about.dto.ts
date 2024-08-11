import { IsOptional, IsString } from "class-validator";

export class CreateAboutDto {
  @IsString()
  poster: string;

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
}
