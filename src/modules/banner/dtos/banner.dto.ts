import { Exclude, Expose } from "class-transformer";

export class BannerDto {
  @Expose()
  id: number;

  @Expose()
  poster: string;

  @Exclude()
  title: string;

  @Exclude()
  description: string;

  @Exclude()
  subtitle: string;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
