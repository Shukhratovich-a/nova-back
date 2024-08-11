import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class OrderTagDto {
  @IsNumber()
  order: number;

  @IsNumber()
  id: number;
}

export class OrderTagsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderTagDto)
  data: OrderTagDto[];
}
