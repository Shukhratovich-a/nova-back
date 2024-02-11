import { Type } from "class-transformer";
import { IsString, IsArray, ValidateNested } from "class-validator";

import { VideoProductDto } from "./video.dto";

export class CreateVideoDto {
  @IsString()
  titleEn: string;

  @IsString()
  titleRu: string;

  @IsString()
  titleTr: string;

  @IsString()
  titleAr: string;

  @IsString()
  video: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoProductDto)
  products: VideoProductDto[];
}
