import { Exclude, Expose } from "class-transformer";

import { DetailCategoryDto } from "@modules/detail/dtos/detail.dto";

export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Exclude()
  title: string;

  @Exclude()
  description: string;

  @Expose()
  images: ProductImageDto[];

  @Exclude()
  detailCategories: DetailCategoryDto[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}

export class ProductImageDto {
  @Expose()
  id: number;

  @Expose()
  jpgPath: string;

  @Expose()
  webpPath: string;

  @Expose()
  type: string;
}
