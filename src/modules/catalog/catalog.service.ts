import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Not, Repository } from "typeorm";

import { LanguageEnum } from "@enums/language.enum";

import { CatalogEntity } from "./catalog.entity";

import { CreateCatalogDto } from "./dtos/create-catalog.dto";
import { UpdateCatalogDto } from "./dtos/update-catalog.dto";

@Injectable()
export class CatalogService {
  constructor(@InjectRepository(CatalogEntity) private readonly catalogRepository: Repository<CatalogEntity>) {}

  // FIND
  async findAll(language: LanguageEnum) {
    return await this.catalogRepository.find({ where: { language } });
  }

  // CREATE
  async createCatalog(catalogDto: CreateCatalogDto) {
    return await this.catalogRepository.save(this.catalogRepository.create({ ...catalogDto }));
  }

  // UPDATE
  async updateCatalog(catalogDto: UpdateCatalogDto, catalogId: number) {
    return await this.catalogRepository.save({ ...catalogDto, id: catalogId });
  }

  // UPDATE
  async deleteCatalog(catalogId: number) {
    return await this.catalogRepository.delete({ id: catalogId });
  }

  // CHECKERS
  async checkCatalogById(catalogId: number) {
    return this.catalogRepository.findOne({ where: { id: catalogId } });
  }

  async checkCatalogForExist(year: string, language: LanguageEnum) {
    return this.catalogRepository.findOne({ where: { year, language } });
  }

  async checkCatalogForExistById(catalogId: number, year: string, language: LanguageEnum) {
    const catalog = await this.catalogRepository.findOne({ where: { year, language, id: Not(catalogId) } });

    return catalog;
  }
}
