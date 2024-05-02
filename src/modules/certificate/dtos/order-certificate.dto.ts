import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class OrderCertificateDto {
  @IsNumber()
  order: number;

  @IsNumber()
  id: number;
}

export class OrderCertificatesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderCertificateDto)
  data: OrderCertificateDto[];
}
