import { Exclude, Expose } from "class-transformer";
import { IsNumber } from "class-validator";

import { ProductDto } from "@modules/tr/product/dtos/product.dto";

export class InstallationDto {
  @Expose()
  id: number;

  @Expose()
  installation: string;

  @Exclude()
  title: string;

  @Expose()
  products: ProductDto[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}

export class InstallationProductDto {
  @IsNumber()
  id: number;
}
