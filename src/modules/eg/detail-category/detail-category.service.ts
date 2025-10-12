import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { DetailCategoryEntity } from "./detail-category.entity";

import { DetailCategoryDto } from "./dtos/detail-category.dto";
import { CreateDetailCategoryDto } from "./dtos/create-detail-category.dto";
import { UpdateDetailCategoryDto } from "./dtos/update-detail-category.dto";
import { OrderDetailCategoryDto } from "./dtos/order-detail-category.dto";

// DETAIL CATEGORY
@Injectable()
export class DetailCategoryService {
  constructor(
    @InjectRepository(DetailCategoryEntity, "db_eg") private readonly detailCategoryRepository: Repository<DetailCategoryEntity>,
  ) {}

  // FIND
  async findAll() {
    return this.detailCategoryRepository.find();
  }

  async findAllWithCount({ page = 1, limit = 10 }: IPagination) {
    const [categories, total] = await this.detailCategoryRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
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

  // ORDER
  async order(detailCategories: OrderDetailCategoryDto[]) {
    try {
      for (const { id, order } of detailCategories) {
        const currentDetailCategory = await this.detailCategoryRepository.find({ where: { id } });
        if (!currentDetailCategory) continue;

        await this.detailCategoryRepository.save({ order, id });
      }

      return { success: true };
    } catch {
      throw new BadRequestException();
    }
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
