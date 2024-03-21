import { Exclude, Expose } from "class-transformer";

import { CategoryDto } from "@modules/category/dtos/category.dto";
import { ProductDto } from "@modules/product/dtos/product.dto";

export class SubcategoryDto {
  @Expose()
  id: number;

  @Expose()
  poster: string;

  @Exclude()
  title: string;

  @Expose()
  alias: string;

  @Expose()
  category: CategoryDto;

  @Expose()
  products: ProductDto[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
