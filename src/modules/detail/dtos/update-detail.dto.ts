import { IsString, IsNumber, IsOptional } from "class-validator";

export class UpdateDetailDto {
  @IsString()
  @IsOptional()
  valueEn?: string;

  @IsString()
  @IsOptional()
  valueRu?: string;

  @IsString()
  @IsOptional()
  valueTr?: string;

  @IsString()
  @IsOptional()
  valueAr?: string;

  @IsNumber()
  @IsOptional()
  typeId?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsNumber()
  @IsOptional()
  productId?: number;
}
