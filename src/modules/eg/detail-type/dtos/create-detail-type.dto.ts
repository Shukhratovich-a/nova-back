import { IsOptional, IsString } from "class-validator";

export class CreateDetailTypeDto {
  @IsString()
  titleRu: string;

  @IsString()
  titleEn: string;

  @IsString()
  titleTr: string;

  @IsString()
  @IsOptional()
  titleAr: string;
}
