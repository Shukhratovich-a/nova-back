import { Exclude, Expose } from "class-transformer";

import { SubcategoryDto } from "@/modules/subcategory/dtos/subcategory.dto";
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
  mainImage: string;

  @Expose()
  boxImage: string;

  @Expose()
  subcategory?: SubcategoryDto;

  @Expose()
  schemeImage: string;

  @Exclude()
  detailCategories: DetailCategoryDto[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
