import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class OrderDetailCategoryDto {
  @IsNumber()
  order: number;

  @IsNumber()
  id: number;
}

export class OrderDetailCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailCategoryDto)
  data: OrderDetailCategoryDto[];
}
