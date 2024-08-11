import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class OrderAboutDto {
  @IsNumber()
  order: number;

  @IsNumber()
  id: number;
}

export class OrderAboutsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderAboutDto)
  data: OrderAboutDto[];
}
