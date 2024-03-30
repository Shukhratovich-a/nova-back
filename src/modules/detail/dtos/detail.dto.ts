import { Exclude, Expose } from "class-transformer";

export class DetailDto {
  @Expose()
  id: number;

  @Expose()
  value: string;

  @Exclude()
  title: string;

  @Exclude()
  dimension: string;
}
