import { Exclude, Expose } from "class-transformer";

import { ContactTypeEnum } from "@/enums/contact-type.enum";

export class ContactDto {
  @Expose()
  id: number;

  @Exclude()
  company: number;

  @Exclude()
  address: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  type: ContactTypeEnum;

  @Exclude()
  country: string;

  @Expose()
  map: string;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
