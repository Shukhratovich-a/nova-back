import { Type } from "class-transformer";
import { IsString, IsArray, ValidateNested, IsOptional } from "class-validator";

import { InstallationProductDto } from "./installation.dto";

export class CreateInstallationDto {
  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  @IsOptional()
  titleRu?: string;

  @IsString()
  @IsOptional()
  titleTr?: string;

  @IsString()
  @IsOptional()
  titleAr?: string;

  @IsString()
  @IsOptional()
  installation: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstallationProductDto)
  products: InstallationProductDto[];
}
