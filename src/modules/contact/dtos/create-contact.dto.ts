import { IsEnum, IsOptional, IsString } from "class-validator";

import { ContactTypeEnum } from "@enums/contact-type.enum";

export class CreateContactDto {
  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  map: string;

  @IsEnum(ContactTypeEnum)
  type: ContactTypeEnum;
}
