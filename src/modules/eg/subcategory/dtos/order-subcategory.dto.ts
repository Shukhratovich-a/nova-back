import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class OrderSubcategoryDto {
  @IsNumber()
  order: number;

  @IsNumber()
  id: number;
}

export class OrderSubcategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderSubcategoryDto)
  data: OrderSubcategoryDto[];
}
