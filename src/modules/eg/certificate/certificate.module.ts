import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CertificateEntity } from "./certificate.entity";

import { CertificateController } from "./certificate.controller";

import { CertificateService } from "./certificate.service";

@Module({
  imports: [TypeOrmModule.forFeature([CertificateEntity], "db_eg")],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
