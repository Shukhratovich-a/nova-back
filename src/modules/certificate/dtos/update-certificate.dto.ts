import { IsEnum, IsOptional, IsString } from "class-validator";

import { StatusEnum } from "@enums/status.enum";

export class UpdateCertificateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  certificate: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
