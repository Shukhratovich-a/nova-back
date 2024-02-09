import { Exclude, Expose } from "class-transformer";

export class DetailDto {
  @Expose()
  id: number;

  @Expose()
  value: string;

  @Exclude()
  title: string;
}

export class DetailCategoryDto {
  @Expose()
  id: number;

  @Exclude()
  title: string;

  @Exclude()
  details: DetailDto[];
}
