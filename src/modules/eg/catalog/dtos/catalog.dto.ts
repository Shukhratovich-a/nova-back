import { Exclude, Expose } from "class-transformer";

export class CatalogDto {
  @Expose()
  id: number;

  @Expose()
  poster: number;

  @Exclude()
  title: string;

  @Exclude()
  subtitle: string;

  @Expose()
  catalog: string;

  @Expose()
  year: string;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
