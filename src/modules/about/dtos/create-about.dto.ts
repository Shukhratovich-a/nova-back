import { IsOptional, IsString } from "class-validator";

export class CreateAboutDto {
  @IsString()
  poster: string;

  @IsString()
  titleRu: string;

  @IsString()
  titleEn: string;

  @IsString()
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
