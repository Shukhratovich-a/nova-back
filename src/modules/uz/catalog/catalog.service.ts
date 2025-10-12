import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { CatalogEntity } from "./catalog.entity";

import { CatalogDto } from "./dtos/catalog.dto";
import { CreateCatalogDto } from "./dtos/create-catalog.dto";
import { UpdateCatalogDto } from "./dtos/update-catalog.dto";

@Injectable()
export class CatalogService {
  constructor(@InjectRepository(CatalogEntity, "db_uz") private readonly catalogRepository: Repository<CatalogEntity>) {}

  // FIND
  async findAll(language: LanguageEnum) {
    const [catalogs, total] = await this.catalogRepository.findAndCount();

    const parsedCatalogs = catalogs.map((catalog) => this.parse(catalog, language));

    return { data: parsedCatalogs, total };
  }

  async findAllWithCount({ page = 1, limit = 10 }: IPagination) {
    const [catalogs, total] = await this.catalogRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!catalogs) return [];

    return {
      data: catalogs.map((catalog) => {
        catalog.poster = process.env.HOST + catalog.poster;
        catalog.catalog = process.env.HOST + catalog.catalog;

        return catalog;
      }),
      total,
    };
  }

  async findOneWithContents(catalogId: number) {
    const catalog = await this.catalogRepository.findOne({
      where: { id: catalogId },
    });
    if (!catalog) return null;

    catalog.poster = process.env.HOST + catalog.poster;
    catalog.catalog = process.env.HOST + catalog.catalog;

    return catalog;
  }

  // CREATE
  async create(catalogDto: CreateCatalogDto) {
    return await this.catalogRepository.save(this.catalogRepository.create({ ...catalogDto }));
  }

  // UPDATE
  async update(catalogDto: UpdateCatalogDto, catalogId: number) {
    return await this.catalogRepository.save({ ...catalogDto, id: catalogId });
  }

  // DELETE
  async delete(catalogId: number) {
    return await this.catalogRepository.delete({ id: catalogId });
  }

  // CHECKERS
  async checkById(catalogId: number) {
    return this.catalogRepository.findOne({ where: { id: catalogId } });
  }

  // PARSERS
  parse(catalog: CatalogEntity, language: LanguageEnum) {
    const newCatalog: CatalogDto = plainToClass(CatalogDto, catalog, { excludeExtraneousValues: true });

    newCatalog.title = catalog[`title${capitalize(language)}`];
    newCatalog.subtitle = catalog[`subtitle${capitalize(language)}`];

    return newCatalog;
  }
}
