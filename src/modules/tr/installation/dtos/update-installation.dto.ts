import { Type } from "class-transformer";
import { IsString, IsOptional, IsArray, ValidateNested } from "class-validator";

import { InstallationProductDto } from "./installation.dto";

export class UpdateInstallationDto {
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
  installation?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InstallationProductDto)
  products: InstallationProductDto[];
}
