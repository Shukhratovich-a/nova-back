import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { LanguageEnum } from "@enums/language.enum";
import { IPagination } from "@interfaces/pagination.interface";

import { capitalize } from "@utils/capitalize.utils";

import { CertificateEntity } from "./certificate.entity";

import { CertificateDto } from "./dtos/certificate.dto";
import { CreateCertificateDto } from "./dtos/create-certificate.dto";
import { UpdateCertificateDto } from "./dtos/update-certificate.dto";
import { OrderCertificateDto } from "./dtos/order-certificate.dto";

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(CertificateEntity, "db_tr") private readonly certificateRepository: Repository<CertificateEntity>,
  ) {}

  // FIND
  async findAll({ page = 1, limit = 10 }: IPagination, language?: LanguageEnum) {
    const certificates = await this.certificateRepository.find({ take: limit, skip: (page - 1) * limit });
    if (!certificates) return [];

    const parsedCertificates: CertificateDto[] = certificates.map((certificate) => this.parse(certificate, language));

    return parsedCertificates;
  }

  async findAllWithCount({ page = 1, limit = 10 }: IPagination) {
    const [certificates, total] = await this.certificateRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
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

  // ORDER
  async order(certificates: OrderCertificateDto[]) {
    try {
      for (const { id, order } of certificates) {
        const currentCertificate = await this.certificateRepository.find({ where: { id } });
        if (!currentCertificate) continue;

        await this.certificateRepository.save({ order, id });
      }

      return { success: true };
    } catch {
      throw new BadRequestException();
    }
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

  // PARSERS
  parse(about: CertificateEntity, language: LanguageEnum) {
    const newAbout: CertificateDto = plainToClass(CertificateDto, about, { excludeExtraneousValues: true });

    newAbout.title = about[`title${capitalize(language)}`];

    return newAbout;
  }
}
