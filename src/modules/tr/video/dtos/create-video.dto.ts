import { Type } from "class-transformer";
import { IsString, IsArray, ValidateNested, IsOptional } from "class-validator";

import { VideoProductDto } from "./video.dto";

export class CreateVideoDto {
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
  video: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoProductDto)
  products: VideoProductDto[];
}
