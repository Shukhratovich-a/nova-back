import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { capitalize } from "@utils/capitalize.utils";

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
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!categories) return [];

    const parsedCategories: CategoryDto[] = categories.map((category) => this.parse(category, language));

    return { data: parsedCategories, total };
  }

  async findAllWithChildren(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      relations: { subcategories: true },
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!categories) return [];

    const parsedCategories: CategoryDto[] = categories.map((category) => {
      const newCategory = this.parse(category, language);
      newCategory.subcategories = category.subcategories.map((subcategory) =>
        this.subcategoryService.parse(subcategory, language),
      );

      return newCategory;
    });

    return { data: parsedCategories, total };
  }

  async findById(categoryId: number, language: LanguageEnum, status: StatusEnum) {
    const category = await this.categoryRepository.findOne({
      relations: { subcategories: true },
      where: { id: categoryId, status },
    });
    if (!category) return null;

    const parsedCategory: CategoryDto = this.parse(category, language);

    parsedCategory.subcategories = category.subcategories.map((subcategory) =>
      this.subcategoryService.parse(subcategory, language),
    );

    return parsedCategory;
  }

  async findByAlias(alias: string, language: LanguageEnum, status: StatusEnum) {
    const category = await this.categoryRepository.findOne({
      relations: { subcategories: true },
      where: { alias: alias, status },
    });
    if (!category) return null;

    const parsedCategory: CategoryDto = this.parse(category, language);

    parsedCategory.subcategories = category.subcategories.map((subcategory) =>
      this.subcategoryService.parse(subcategory, language),
    );

    return parsedCategory;
  }

  async findAllWithContents(status: StatusEnum, { page, limit }: IPagination) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!categories) return [];

    return {
      data: categories.map((category) => {
        category.poster = process.env.HOST + category.poster;
        return category;
      }),
      total,
    };
  }

  async findOneWithContents(categoryId: number, status: StatusEnum) {
    const category = await this.categoryRepository.findOne({
      where: { status, id: categoryId },
    });
    if (!category) return null;

    category.poster = process.env.HOST + category.poster;

    return category;
  }

  // CREATE
  async create(categoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(this.categoryRepository.create({ ...categoryDto }));
  }

  // UPDATE
  async update(categoryDto: UpdateCategoryDto, categoryId: number) {
    return await this.categoryRepository.save({ ...categoryDto, id: categoryId });
  }

  // DELETE
  async delete(categoryId: number) {
    return await this.categoryRepository.save({ status: StatusEnum.DELETED, id: categoryId });
  }

  // CHECKERS
  async checkById(categoryId: number) {
    return this.categoryRepository.findOne({ where: { id: categoryId } });
  }

  // PARSERS
  parse(category: CategoryEntity, language: LanguageEnum) {
    const newCategory: CategoryDto = plainToClass(CategoryDto, category, { excludeExtraneousValues: true });

    newCategory.title = category[`title${capitalize(language)}`];

    return newCategory;
  }
}
