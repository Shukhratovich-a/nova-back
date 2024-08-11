import { Inject, Injectable, forwardRef, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { CategoryEntity } from "./category.entity";

import { SubcategoryService } from "@modules/eg/subcategory/subcategory.service";
import { CronService } from "@modules/eg/cron/cron.service";

import { CategoryDto } from "./dtos/category.dto";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { OrderCategoryDto } from "./dtos/order-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity, "db_eg") private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject(forwardRef(() => SubcategoryService)) private readonly subcategoryService: SubcategoryService,
    @Inject(forwardRef(() => CronService)) private readonly cronService: CronService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, { page = 1, limit = 0 }: IPagination) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!categories) return [];

    const parsedCategories: CategoryDto[] = categories.map((category) => this.parse(category, language));

    return { data: parsedCategories, total };
  }

  async findAllWithChildren(language: LanguageEnum, { page = 1, limit = 0 }: IPagination) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      relations: { subcategories: true },
      take: limit,
      skip: (page - 1) * limit,
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

  async findById(categoryId: number, language: LanguageEnum) {
    const category = await this.categoryRepository.findOne({
      relations: { subcategories: true },
      where: { id: categoryId },
    });
    if (!category) return null;

    const parsedCategory: CategoryDto = this.parse(category, language);

    parsedCategory.subcategories = category.subcategories.map((subcategory) =>
      this.subcategoryService.parse(subcategory, language),
    );

    return parsedCategory;
  }

  async findByAlias(alias: string, language: LanguageEnum) {
    const category = await this.categoryRepository.findOne({
      relations: { subcategories: true },
      where: { alias: alias },
    });
    if (!category) return null;

    const parsedCategory: CategoryDto = this.parse(category, language);

    parsedCategory.subcategories = category.subcategories.map((subcategory) =>
      this.subcategoryService.parse(subcategory, language),
    );

    return parsedCategory;
  }

  async findAllWithContents({ page = 1, limit = 0 }: IPagination) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
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

  async findOneWithContents(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) return null;

    category.poster = process.env.HOST + category.poster;

    return category;
  }

  // ORDER
  async order(categories: OrderCategoryDto[]) {
    try {
      for (const { id, order } of categories) {
        const currentTag = await this.categoryRepository.find({ where: { id } });
        if (!currentTag) continue;

        await this.categoryRepository.save({ order, id });
      }

      return { success: true };
    } catch {
      throw new BadRequestException();
    }
  }

  // CREATE
  async create(categoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.save(this.categoryRepository.create({ ...categoryDto }));

    this.cronService.sendRequest(`/category`);

    return category;
  }

  // UPDATE
  async update(categoryDto: UpdateCategoryDto, categoryId: number) {
    const category = await this.categoryRepository.save({ ...categoryDto, id: categoryId });

    this.cronService.sendRequest(`/category`);

    return category;
  }

  // DELETE
  async delete(categoryId: number) {
    const category = await this.categoryRepository.delete(categoryId);

    this.cronService.sendRequest(`/category`);

    return category;
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
