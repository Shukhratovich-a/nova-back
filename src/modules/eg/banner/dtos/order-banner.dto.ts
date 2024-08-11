import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class OrderBannerDto {
  @IsNumber()
  order: number;

  @IsNumber()
  id: number;
}

export class OrderBannersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderBannerDto)
  data: OrderBannerDto[];
}
