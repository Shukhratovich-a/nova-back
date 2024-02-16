import { Exclude, Expose } from "class-transformer";
import { IsNumber } from "class-validator";

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

  tags: string[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}

export class NewsTagDto {
  @IsNumber()
  id: number;
}
