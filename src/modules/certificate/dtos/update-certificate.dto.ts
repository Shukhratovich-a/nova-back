import { IsOptional, IsString } from "class-validator";

export class UpdateCertificateDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  poster?: string;

  @IsString()
  @IsOptional()
  certificate?: string;
}
