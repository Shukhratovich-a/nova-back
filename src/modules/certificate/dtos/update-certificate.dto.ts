import { IsEnum, IsOptional, IsString } from "class-validator";

import { StatusEnum } from "@enums/status.enum";

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

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
