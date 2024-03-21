import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { IPagination } from "@interfaces/pagination.interface";

import { CertificateEntity } from "./certificate.entity";

import { CreateCertificateDto } from "./dtos/create-certificate.dto";
import { UpdateCertificateDto } from "./dtos/update-certificate.dto";

@Injectable()
export class CertificateService {
  constructor(@InjectRepository(CertificateEntity) private readonly certificateRepository: Repository<CertificateEntity>) {}

  // FIND
  async findAll({ page, limit }: IPagination) {
    return await this.certificateRepository.find({
      take: limit,
      skip: (page - 1) * limit || 0,
    });
  }

  async findAllWithCount({ page, limit }: IPagination) {
    const [certificates, total] = await this.certificateRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!certificates) return [];

    return {
      data: certificates.map((certificate) => {
        certificate.poster = process.env.HOST + certificate.poster;
        certificate.certificate = process.env.HOST + certificate.certificate;

        return certificate;
      }),
      total,
    };
  }

  async findOneWithContents(certificateId: number) {
    const certificate = await this.certificateRepository.findOne({
      where: { id: certificateId },
    });
    if (!certificate) return null;

    certificate.poster = process.env.HOST + certificate.poster;
    certificate.certificate = process.env.HOST + certificate.certificate;

    return certificate;
  }

  // CREATE
  async create(certificateDto: CreateCertificateDto) {
    return await this.certificateRepository.save(this.certificateRepository.create({ ...certificateDto }));
  }

  // UPDATE
  async update(certificateDto: UpdateCertificateDto, certificateId: number) {
    return await this.certificateRepository.save({ ...certificateDto, id: certificateId });
  }

  // DELETE
  async delete(certificateId: number) {
    return await this.certificateRepository.delete(certificateId);
  }

  // CHECKERS
  async checkCertificateById(certificateId: number) {
    return this.certificateRepository.findOne({ where: { id: certificateId } });
  }
}
