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
  constructor(
    @InjectRepository(CertificateEntity) private readonly certificateRepository: Repository<CertificateEntity>,
  ) {}

  // FIND
  async findAll(status: StatusEnum, { page, limit }: IPagination) {
    return await this.certificateRepository.find({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
  }

  // CREATE
  async createCertificate(certificateDto: CreateCertificateDto) {
    return await this.certificateRepository.save(this.certificateRepository.create({ ...certificateDto }));
  }

  // UPDATE
  async updateCertificate(certificateDto: UpdateCertificateDto, certificateId: number) {
    return await this.certificateRepository.save({ ...certificateDto, id: certificateId });
  }

  // CHECKERS
  async checkCertificateById(certificateId: number) {
    return this.certificateRepository.findOne({ where: { id: certificateId } });
  }
}
