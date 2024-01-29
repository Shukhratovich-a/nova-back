import { IsString } from "class-validator";

export class CreateCertificateDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  certificate: string;
}
