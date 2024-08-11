import { Exclude, Expose } from "class-transformer";
import { IsNumber } from "class-validator";

import { ProductDto } from "@modules/uz/product/dtos/product.dto";

export class VideoDto {
  @Expose()
  id: number;

  @Expose()
  video: string;

  @Exclude()
  title: string;

  @Expose()
  products: ProductDto[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}

export class VideoProductDto {
  @IsNumber()
  id: number;
}
