import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { InstallationEntity } from "./installation.entity";

import { ProductService } from "@modules/tr/product/product.service";

import { InstallationDto } from "./dtos/installation.dto";
import { CreateInstallationDto } from "./dtos/create-installation.dto";
import { UpdateInstallationDto } from "./dtos/update-installation.dto";

@Injectable()
export class InstallationService {
  constructor(
    @InjectRepository(InstallationEntity, "db_tr") private readonly installationRepository: Repository<InstallationEntity>,
    private readonly productService: ProductService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, { page = 1, limit = 0 }: IPagination) {
    const installations = await this.installationRepository.find({
      relations: { products: true },
      take: limit,
      skip: (page - 1) * limit,
      order: { products: { code: "ASC" } },
    });
    if (!installations) return [];

    const parsedInstallations: InstallationDto[] = await this.parseAll(installations, language);

    return parsedInstallations;
  }

  async findById(installationId: number, language: LanguageEnum) {
    const installation = await this.installationRepository.findOne({
      relations: { products: true },
      where: { id: installationId },
      order: { products: { code: "ASC" } },
    });
    if (!installation) return null;

    const parsedInstallation: InstallationDto = await this.parse(installation, language);

    return parsedInstallation;
  }

  async findByProductId(productId: number, language: LanguageEnum) {
    const installations = await this.installationRepository.find({
      relations: { products: true },
      where: { products: { id: productId } },
      order: { products: { code: "ASC" } },
    });

    const parsedInstallations: InstallationDto[] = await this.parseAll(installations, language);

    return parsedInstallations;
  }

  async findByProductCode(productCode: string, language: LanguageEnum) {
    const installations = await this.installationRepository.find({
      relations: { products: true },
      where: { products: { code: productCode } },
      order: { products: { code: "ASC" } },
    });

    const parsedInstallations: InstallationDto[] = await this.parseAll(installations, language);

    return parsedInstallations;
  }

  async findAllWithCount({ page = 1, limit = 0 }: IPagination) {
    const [installations, total] = await this.installationRepository.findAndCount({
      relations: { products: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!installations) return [];

    return { data: installations, total };
  }

  async findOneWithContents(installationId: number) {
    const installation = await this.installationRepository.findOne({
      relations: { products: true },
      where: { id: installationId },
      order: { products: { code: "ASC" } },
    });
    if (!installation) return null;

    return installation;
  }

  async findAllByParentId(installationId: number, { page = 1, limit = 0 }: IPagination) {
    const [installations, total] = await this.installationRepository.findAndCount({
      relations: { products: true },
      where: { products: { id: installationId } },
      take: limit,
      skip: (page - 1) * limit,
      order: { products: { code: "ASC" } },
    });
    if (!installations) return [];

    return { data: installations, total };
  }

  // CREATE
  async create(installationDto: CreateInstallationDto) {
    return await this.installationRepository.save(
      this.installationRepository.create({ ...installationDto, products: installationDto.products }),
    );
  }

  // UPDATE
  async update(installationDto: UpdateInstallationDto, installationId: number) {
    return await this.installationRepository.save({ ...installationDto, id: installationId });
  }

  // DELETE
  async delete(installationId: number) {
    return await this.installationRepository.delete(installationId);
  }

  // PARSERS
  async parse(installation: InstallationEntity, language: LanguageEnum) {
    const newInstallation: InstallationDto = plainToClass(InstallationDto, installation, { excludeExtraneousValues: true });

    newInstallation.title = installation[`title${capitalize(language)}`];

    if (newInstallation.products && newInstallation.products.length > 0) {
      newInstallation.products = await this.productService.parseAll(installation.products, language);
    }

    return newInstallation;
  }

  async parseAll(installations: InstallationEntity[], language: LanguageEnum) {
    const newInstallations: InstallationDto[] = [];

    for (const installation of installations) {
      newInstallations.push(await this.parse(installation, language));
    }

    return newInstallations;
  }

  // CHECKERS
  async checkById(installationId: number) {
    return this.installationRepository.findOne({ where: { id: installationId } });
  }
}
