import { IsEnum, IsOptional, IsString } from "class-validator";

import { ContactTypeEnum } from "@enums/contact-type.enum";

export class UpdateContactDto {
  @IsString()
  @IsOptional()
  companyEn?: string;

  @IsString()
  @IsOptional()
  companyRu?: string;

  @IsString()
  @IsOptional()
  companyTr?: string;

  @IsString()
  @IsOptional()
  companyAr?: string;

  @IsString()
  @IsOptional()
  addressEn?: string;

  @IsString()
  @IsOptional()
  addressRu?: string;

  @IsString()
  @IsOptional()
  addressTr?: string;

  @IsString()
  @IsOptional()
  addressEnAr?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  countryEn?: string;

  @IsString()
  @IsOptional()
  countryRu?: string;

  @IsString()
  @IsOptional()
  countryAr?: string;

  @IsString()
  @IsOptional()
  countryTr?: string;

  @IsString()
  @IsOptional()
  map?: string;

  @IsEnum(ContactTypeEnum)
  @IsOptional()
  type?: ContactTypeEnum;
}
