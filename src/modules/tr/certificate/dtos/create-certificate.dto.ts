import { IsOptional, IsString } from "class-validator";

export class CreateCertificateDto {
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
  poster: string;

  @IsString()
  certificate: string;
}
