import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { DetailCategoryService } from "@modules/eg/detail-category/detail-category.service";

import { DetailEntity } from "./detail.entity";

import { DetailDto } from "./dtos/detail.dto";
import { CreateDetailDto } from "./dtos/create-detail.dto";
import { UpdateDetailDto } from "./dtos/update-detail.dto";
import { DetailCategoryDto } from "@modules/eg/detail-category/dtos/detail-category.dto";

import { other } from "./detail.constants";

// DETAIL
@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(DetailEntity, "db_eg") private readonly detailRepository: Repository<DetailEntity>,
    private readonly detailCategoryService: DetailCategoryService,
  ) {}

  // FIND
  async findAllWithCount({ page = 1, limit = 0 }: IPagination) {
    const [details, total] = await this.detailRepository.findAndCount({
      relations: { type: true, category: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!details) return [];

    return { data: details, total };
  }

  async findOneWithContents(detailId: number) {
    const detail = await this.detailRepository.findOne({
      relations: { type: true, category: true },
      where: { id: detailId },
    });
    if (!detail) return null;

    return detail;
  }

  async findAllByParentId(productId: number, { page = 1, limit = 0 }: IPagination) {
    const [details, total] = await this.detailRepository.findAndCount({
      relations: { type: true, category: true },
      where: { product: { id: productId } },
      order: { category: { order: "ASC" }, type: { order: "ASC" } },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!details) return [];

    return { data: details, total };
  }

  // CREATE
  async create(detailDto: CreateDetailDto) {
    return await this.detailRepository.save(
      this.detailRepository.create({
        ...detailDto,
        product: { id: detailDto.productId },
        type: { id: detailDto.typeId },
        category: { id: detailDto.categoryId },
        dimension: { id: detailDto.dimensionId },
      }),
    );
  }

  // UPDATE
  async update(detailDto: UpdateDetailDto, detailId: number) {
    return await this.detailRepository.save({ ...detailDto, id: detailId });
  }

  // DELETE
  async delete(typeId: number) {
    return await this.detailRepository.delete(typeId);
  }

  async deleteByParent(parentId: number) {
    const details = await this.detailRepository.find({ where: { product: { id: parentId } } });

    details.forEach(async (detail) => {
      await this.detailRepository.delete(detail.id);
    });

    return true;
  }

  // CHECKERS
  async checkById(detailId: number) {
    return this.detailRepository.findOne({ where: { id: detailId } });
  }

  // PARSERS
  parse(detail: DetailEntity, language: LanguageEnum) {
    const newDetail: DetailDto = plainToClass(DetailDto, detail, { excludeExtraneousValues: true });

    newDetail.value = detail[`value${capitalize(language)}`];
    if (detail.dimension) newDetail.value = `${newDetail.value} ${detail.dimension[`title${capitalize(language)}`]}`;

    if (detail.type) {
      newDetail.title = detail.type[`title${capitalize(language)}`];
    } else {
      newDetail.title = null;
    }

    return newDetail;
  }

  // ASSETS
  async sortDetails(details: DetailEntity[], language: LanguageEnum) {
    if (!details || !details.length) return [];

    const newDetails: DetailCategoryDto[] = [];
    const detailCategories = await this.detailCategoryService.findAll();

    detailCategories.forEach((category) => {
      const filteredDetails = details.filter((detail) => detail.category && detail.category.id === category.id);

      if (filteredDetails.length) {
        const newCategory: DetailCategoryDto = this.detailCategoryService.parse(category, language);
        newCategory.details = filteredDetails.map((detail) => this.parse(detail, language));

        newDetails.push(newCategory);
      }
    });

    const otherDetails = details.filter((detail) => !detail.category);
    if (otherDetails.length > 0) {
      const otherCategory: DetailCategoryDto = {
        id: Date.now(),
        title: other[`title${capitalize(language)}`],
        details: otherDetails.map((detail) => this.parse(detail, language)),
      };
      newDetails.push(otherCategory);
    }

    return newDetails;
  }
}
