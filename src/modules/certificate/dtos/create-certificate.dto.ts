import { IsString } from "class-validator";

export class CreateCertificateDto {
  @IsString()
  title: string;

  @IsString()
  poster: string;

  @IsString()
  certificate: string;
}
