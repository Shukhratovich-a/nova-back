import { Exclude, Expose } from "class-transformer";

export class TagDto {
  @Expose()
  id: number;

  @Exclude()
  title: string;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
