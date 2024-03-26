import { IsOptional, IsNumberString } from "class-validator";

export class IPagination {
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;
}
