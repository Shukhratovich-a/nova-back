import { Exclude, Expose } from "class-transformer";

export class CertificateDto {
  @Expose()
  id: number;

  @Expose()
  poster: string;

  @Exclude()
  title: string;

  @Expose()
  certificate: string;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
