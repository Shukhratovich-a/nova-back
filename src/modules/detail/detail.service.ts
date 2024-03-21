import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { DetailEntity, DetailCategoryEntity, DetailTypeEntity } from "./detail.entity";

import { DetailCategoryDto, DetailDto } from "./dtos/detail.dto";
import { CreateDetailDto, CreateDetailCategoryDto, CreateDetailTypeDto } from "./dtos/create-detail.dto";
import { UpdateDetailDto, UpdateDetailCategoryDto, UpdateDetailTypeDto } from "./dtos/update-detail.dto";

import { other } from "./detail.constants";

// DETAIL CATEGORY
@Injectable()
export class DetailCategoryService {
  constructor(
    @InjectRepository(DetailCategoryEntity) private readonly detailCategoryRepository: Repository<DetailCategoryEntity>,
  ) {}

  // FIND
  async findAll() {
    return this.detailCategoryRepository.find();
  }

  async findAllWithCount({ page, limit }: IPagination) {
    const [categories, total] = await this.detailCategoryRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!categories) return [];

    return { data: categories, total };
  }

  async findOneWithContents(categoryId: number) {
    const category = await this.detailCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) return null;

    return category;
  }

  // CREATE
  async create(categoryDto: CreateDetailCategoryDto) {
    return await this.detailCategoryRepository.save(this.detailCategoryRepository.create({ ...categoryDto }));
  }

  // UPDATE
  async update(categoryDto: UpdateDetailCategoryDto, categoryId: number) {
    return await this.detailCategoryRepository.save({ ...categoryDto, id: categoryId });
  }

  // DELETE
  async delete(categoryId: number) {
    return await this.detailCategoryRepository.delete(categoryId);
  }

  // CHECKERS
  async checkById(categoryId: number) {
    return this.detailCategoryRepository.findOne({ where: { id: categoryId } });
  }

  // PARSERS
  parse(category: DetailCategoryEntity, language: LanguageEnum) {
    const newCategory: DetailCategoryDto = plainToClass(DetailCategoryDto, category, { excludeExtraneousValues: true });

    newCategory.title = category[`title${capitalize(language)}`];

    return newCategory;
  }
}

// DETAIL TYPE
@Injectable()
export class DetailTypeService {
  constructor(@InjectRepository(DetailTypeEntity) private readonly detailTypeRepository: Repository<DetailTypeEntity>) {}

  // FIND
  async findAll() {
    return this.detailTypeRepository.find();
  }

  async findAllWithCount({ page, limit }: IPagination) {
    const [types, total] = await this.detailTypeRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!types) return [];

    return { data: types, total };
  }

  async findOneWithContents(typeId: number) {
    const type = await this.detailTypeRepository.findOne({
      where: { id: typeId },
    });
    if (!type) return null;

    return type;
  }

  // CREATE
  async create(typeDto: CreateDetailTypeDto) {
    return await this.detailTypeRepository.save(this.detailTypeRepository.create({ ...typeDto }));
  }

  // UPDATE
  async update(typeDto: UpdateDetailTypeDto, typeId: number) {
    return await this.detailTypeRepository.save({ ...typeDto, id: typeId });
  }

  // DELETE
  async delete(typeId: number) {
    return await this.detailTypeRepository.delete(typeId);
  }

  // CHECKERS
  async checkById(typeId: number) {
    return this.detailTypeRepository.findOne({ where: { id: typeId } });
  }
}

// DETAIL
@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(DetailEntity) private readonly detailRepository: Repository<DetailEntity>,
    private readonly detailCategoryService: DetailCategoryService,
  ) {}

  // FIND
  async findAllWithCount({ page, limit }: IPagination) {
    const [details, total] = await this.detailRepository.findAndCount({
      relations: { type: true, category: true },
      take: limit,
      skip: (page - 1) * limit || 0,
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

  async findAllByParentId(productId: number, { page, limit }: IPagination) {
    const [details, total] = await this.detailRepository.findAndCount({
      relations: { type: true, category: true },
      where: { product: { id: productId } },
      order: { category: { id: "ASC" } },
      take: limit,
      skip: (page - 1) * limit || 0,
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
    const otherCategory: DetailCategoryDto = {
      id: Date.now(),
      title: other[`title${capitalize(language)}`],
      details: otherDetails.map((detail) => this.parse(detail, language)),
    };
    newDetails.push(otherCategory);

    return newDetails;
  }
}
