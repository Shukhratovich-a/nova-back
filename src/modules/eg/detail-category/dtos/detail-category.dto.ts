import { Exclude, Expose } from "class-transformer";

import { DetailDto } from "@modules/eg/detail/dtos/detail.dto";

export class DetailCategoryDto {
  @Expose()
  id: number;

  @Exclude()
  title: string;

  @Exclude()
  details: DetailDto[];
}
