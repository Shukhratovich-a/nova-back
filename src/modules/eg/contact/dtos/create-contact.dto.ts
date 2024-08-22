import { IsEnum, IsString } from "class-validator";

import { ContactTypeEnum } from "@enums/contact-type.enum";

export class CreateContactDto {
  @IsString()
  companyEn: string;

  @IsString()
  companyRu: string;

  @IsString()
  companyTr: string;

  @IsString()
  companyAr: string;

  @IsString()
  addressEn: string;

  @IsString()
  addressRu: string;

  @IsString()
  addressTr: string;

  @IsString()
  addressAr: string;

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
  countryAr: string;

  @IsString()
  map: string;

  @IsEnum(ContactTypeEnum)
  type: ContactTypeEnum;
}
