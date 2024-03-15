import { IsEnum, IsOptional, IsString } from "class-validator";

import { ContactTypeEnum } from "@enums/contact-type.enum";
import { StatusEnum } from "@enums/status.enum";

export class UpdateContactDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  map?: string;

  @IsEnum(ContactTypeEnum)
  @IsOptional()
  type?: ContactTypeEnum;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
