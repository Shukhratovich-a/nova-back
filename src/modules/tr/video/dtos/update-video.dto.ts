import { Type } from "class-transformer";
import { IsString, IsOptional, IsArray, ValidateNested } from "class-validator";

import { VideoProductDto } from "./video.dto";

export class UpdateVideoDto {
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
  video?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VideoProductDto)
  products: VideoProductDto[];
}
