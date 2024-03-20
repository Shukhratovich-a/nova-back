import { IsString } from "class-validator";

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
  titleAr: string;

  @IsString()
  descriptionRu: string;

  @IsString()
  descriptionEn: string;

  @IsString()
  descriptionTr: string;

  @IsString()
  descriptionAr: string;
}
