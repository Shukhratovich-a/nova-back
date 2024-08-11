import { Exclude, Expose } from "class-transformer";

import { SubcategoryDto } from "@modules/eg/subcategory/dtos/subcategory.dto";

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

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}

export class CategoryAdminDto {
  @Expose()
  id: number;

  @Expose()
  poster: string;

  @Exclude()
  titleRu: string;

  @Exclude()
  titleEn: string;

  @Exclude()
  titleTr: string;

  @Exclude()
  titleAr: string;

  @Expose()
  alias: string;

  @Exclude()
  subcategories: SubcategoryDto[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
