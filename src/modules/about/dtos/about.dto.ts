import { Exclude, Expose } from "class-transformer";

export class AboutDto {
  @Expose()
  id: number;

  @Expose()
  poster: string;

  @Exclude()
  title: string;

  @Exclude()
  description: string;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
