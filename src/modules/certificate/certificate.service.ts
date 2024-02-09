import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { IPagination } from "@interfaces/pagination.interface";
import { StatusEnum } from "@enums/status.enum";

import { CertificateEntity } from "./certificate.entity";

import { CreateCertificateDto } from "./dtos/create-certificate.dto";
import { UpdateCertificateDto } from "./dtos/update-certificate.dto";

@Injectable()
export class CertificateService {
  constructor(@InjectRepository(CertificateEntity) private readonly certificateRepository: Repository<CertificateEntity>) {}

  // FIND
  async findAll(status: StatusEnum, { page, limit }: IPagination) {
    return await this.certificateRepository.find({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
  }

  async findAllWithCount(status: StatusEnum, { page, limit }: IPagination) {
    const [certificates, total] = await this.certificateRepository.findAndCount({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!certificates) return [];

    return { data: certificates, total };
  }

  async findOneWithContents(certificateId: number, status: StatusEnum) {
    const certificate = await this.certificateRepository.findOne({
      where: { status, id: certificateId },
    });
    if (!certificate) return null;

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
    return await this.certificateRepository.save({ status: StatusEnum.DELETED, id: certificateId });
  }

  // CHECKERS
  async checkCertificateById(certificateId: number) {
    return this.certificateRepository.findOne({ where: { id: certificateId } });
  }
}
