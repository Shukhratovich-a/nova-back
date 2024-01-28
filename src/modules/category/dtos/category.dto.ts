import { Exclude, Expose } from "class-transformer";

import { SubcategoryDto } from "@modules/subcategory/dtos/subcategory.dto";

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  poster: string;

  @Exclude()
  title: string;

  @Expose()
  alias: string;

  @Exclude()
  subcategories: SubcategoryDto[];

  // @Expose()
  // createAt: Date;

  // @Expose()
  // updateAt: Date;
}
