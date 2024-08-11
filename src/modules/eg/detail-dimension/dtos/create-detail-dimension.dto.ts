import { IsOptional, IsString } from "class-validator";

export class CreateDetailDimensionDto {
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
