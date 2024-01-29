import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CertificateEntity } from "./certificate.entity";

import { CertificateController } from "./certificate.controller";

import { CertificateService } from "./certificate.service";

@Module({
  imports: [TypeOrmModule.forFeature([CertificateEntity])],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
