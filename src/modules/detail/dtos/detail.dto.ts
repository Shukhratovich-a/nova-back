import { Exclude, Expose } from "class-transformer";

export class DetailDto {
  @Expose()
  id: number;

  @Exclude()
  name: string;

  @Exclude()
  value: string;
}

export class DetailCategoryDto {
  @Expose()
  id: number;

  @Exclude()
  title: string;

  @Exclude()
  details: DetailDto[];
}
