import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class OrderDetailTypeDto {
  @IsNumber()
  order: number;

  @IsNumber()
  id: number;
}

export class OrderDetailTypesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailTypeDto)
  data: OrderDetailTypeDto[];
}
