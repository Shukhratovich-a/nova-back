import { IsEnum, IsOptional, IsString } from "class-validator";

import { ContactTypeEnum } from "@enums/contact-type.enum";

export class CreateContactDto {
  @IsString()
  companyEn: string;

  @IsString()
  companyRu: string;

  @IsString()
  companyTr: string;

  @IsString()
  @IsOptional()
  companyAr: string;

  @IsString()
  addressEn: string;

  @IsString()
  addressRu: string;

  @IsString()
  addressTr: string;

  @IsString()
  @IsOptional()
  addressEnAr: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  countryEn: string;

  @IsString()
  countryRu: string;

  @IsString()
  countryTr: string;

  @IsString()
  @IsOptional()
  countryAr: string;

  @IsString()
  map: string;

  @IsEnum(ContactTypeEnum)
  type: ContactTypeEnum;
}
