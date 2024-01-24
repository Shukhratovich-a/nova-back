import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  poster?: string;
}

export class UpdateCategoryContentDto {
  @IsString()
  title: string;
}
