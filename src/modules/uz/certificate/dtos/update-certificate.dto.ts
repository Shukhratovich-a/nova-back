import { IsOptional, IsString } from "class-validator";

export class UpdateCertificateDto {
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
  poster?: string;

  @IsString()
  @IsOptional()
  certificate?: string;
}
