import { IsEnum, IsNumber, IsString } from "class-validator";

import { LanguageEnum } from "@enums/language.enum";
import { ImageTypeEnum } from "@enums/image-type.enum";

export class CreateProductDto {
  @IsString()
  code: string;

  @IsNumber()
  subcategoryId: number;
}

export class CreateProductContentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(LanguageEnum)
  language: LanguageEnum;
}

export class CreateProductImageDto {
  @IsString()
  jpgPath: string;

  @IsString()
  webpPath: string;

  @IsEnum(ImageTypeEnum)
  type: ImageTypeEnum;
}
