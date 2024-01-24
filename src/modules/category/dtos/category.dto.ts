import { Exclude, Expose } from "class-transformer";

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  poster: string;

  @Exclude()
  title: string;

  @Expose()
  alias: string;

  // @Expose()
  // createAt: Date;

  // @Expose()
  // updateAt: Date;
}
