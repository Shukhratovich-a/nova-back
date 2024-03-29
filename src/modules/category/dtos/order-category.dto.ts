import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class OrderCategoryDto {
  @IsNumber()
  order: number;

  @IsNumber()
  id: number;
}

export class OrderCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderCategoryDto)
  data: OrderCategoryDto[];
}
