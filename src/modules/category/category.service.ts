import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { CategoryEntity } from "./category.entity";

import { SubcategoryService } from "@modules/subcategory/subcategory.service";

import { CategoryDto } from "./dtos/category.dto";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject(forwardRef(() => SubcategoryService))
    private readonly subcategoryService: SubcategoryService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const categories = await this.categoryRepository.find({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!categories) return [];

    const parsedCategories: CategoryDto[] = categories.map((category) => {
      return this.parseCategory(category, language);
    });

    return parsedCategories;
  }

  async findById(categoryId: number, language: LanguageEnum, status: StatusEnum) {
    const category = await this.categoryRepository.findOne({
      relations: { subcategories: true },
      where: { id: categoryId, status },
    });
    if (!category) return null;

    const parsedCategory: CategoryDto = this.parseCategory(category, language);

    parsedCategory.subcategories = category.subcategories.map((subcategory) => {
      return this.subcategoryService.parseSubcategory(subcategory, language);
    });

    return parsedCategory;
  }

  async findByAlias(alias: string, language: LanguageEnum, status: StatusEnum) {
    const category = await this.categoryRepository.findOne({
      relations: { subcategories: true },
      where: { alias: alias, status },
    });
    if (!category) return null;

    const parsedCategory: CategoryDto = this.parseCategory(category, language);

    parsedCategory.subcategories = category.subcategories.map((subcategory) => {
      return this.subcategoryService.parseSubcategory(subcategory, language);
    });

    return parsedCategory;
  }

  async findAllWithContents(status: StatusEnum, { page, limit }: IPagination) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!categories) return [];

    return { data: categories, total };
  }

  async findOneWithContents(categoryId: number, status: StatusEnum) {
    const category = await this.categoryRepository.findOne({
      where: { status, id: categoryId },
    });
    if (!category) return null;

    return category;
  }

  // CREATE
  async createCategory(categoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(this.categoryRepository.create({ ...categoryDto }));
  }

  // UPDATE
  async updateCategory(categoryDto: UpdateCategoryDto, categoryId: number) {
    return await this.categoryRepository.save({ ...categoryDto, id: categoryId });
  }

  // DELETE
  async deleteCategory(categoryId: number) {
    return await this.categoryRepository.save({ status: StatusEnum.DELETED, id: categoryId });
  }

  // PARSERS
  parseCategory(category: CategoryEntity, language: LanguageEnum) {
    const newCategory: CategoryDto = plainToClass(CategoryDto, category, { excludeExtraneousValues: true });

    if (language === LanguageEnum.RU) newCategory.title = category.titleRu;
    if (language === LanguageEnum.EN) newCategory.title = category.titleEn;
    if (language === LanguageEnum.TR) newCategory.title = category.titleTr;
    if (language === LanguageEnum.AR) newCategory.title = category.titleAr;

    return newCategory;
  }

  // CHECKERS
  async checkCategoryById(categoryId: number) {
    return this.categoryRepository.findOne({ where: { id: categoryId } });
  }
}
