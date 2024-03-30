import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateDetailDto {
  @IsString()
  valueEn: string;

  @IsString()
  @IsOptional()
  valueRu?: string;

  @IsString()
  @IsOptional()
  valueTr?: string;

  @IsString()
  @IsOptional()
  valueAr?: string;

  @IsOptional()
  @IsNumber()
  typeId?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  order: number;

  @IsNumber()
  @IsOptional()
  productId?: number;
}
