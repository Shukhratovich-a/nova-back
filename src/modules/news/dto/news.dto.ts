import { Exclude, Expose } from "class-transformer";

import { NewsTypeEnum } from "@enums/news-type.enum";

export class NewsDto {
  @Expose()
  id: number;

  @Expose()
  alias: string;

  @Expose()
  poster: string;

  @Expose()
  image?: string;

  @Expose()
  type: NewsTypeEnum;

  @Exclude()
  title: string;

  @Exclude()
  subtitle: string;

  @Exclude()
  body: string;

  @Exclude()
  tag: string;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
