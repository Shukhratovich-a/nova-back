import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { CategoryEntity, CategoryContentEntity } from "./category.entity";

import { SubcategoryService } from "@modules/subcategory/subcategory.service";

import { CategoryDto } from "./dtos/category.dto";
import { CreateCategoryDto, CreateCategoryContentDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto, UpdateCategoryContentDto } from "./dtos/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryContentEntity) private readonly contentRepository: Repository<CategoryContentEntity>,
    @Inject(forwardRef(() => SubcategoryService))
    private readonly subcategoryService: SubcategoryService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const categories = await this.categoryRepository.find({
      relations: { contents: true },
      where: { contents: { language }, status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!categories) return [];

    const parsedCategories: CategoryDto[] = categories.map((category) => {
      return this.parseCategory(category);
    });

    return parsedCategories;
  }

  async findById(categoryId: number, language: LanguageEnum, status: StatusEnum) {
    const category = await this.categoryRepository.findOne({
      relations: { contents: true, subcategories: { contents: true } },
      where: { id: categoryId, contents: { language }, status, subcategories: { contents: { language } } },
    });
    if (!category) return null;

    const parsedCategory: CategoryDto = this.parseCategory(category);

    parsedCategory.subcategories = category.subcategories.map((subcategory) => {
      return this.subcategoryService.parseSubcategory(subcategory);
    });

    return parsedCategory;
  }

  async findByAlias(alias: string, language: LanguageEnum, status: StatusEnum) {
    const category = await this.categoryRepository.findOne({
      relations: { contents: true, subcategories: { contents: true } },
      where: { alias: alias, contents: { language }, status, subcategories: { contents: { language } } },
    });
    if (!category) return null;

    const parsedCategory: CategoryDto = this.parseCategory(category);

    parsedCategory.subcategories = category.subcategories.map((subcategory) => {
      return this.subcategoryService.parseSubcategory(subcategory);
    });

    return parsedCategory;
  }

  // CREATE
  async createCategory(categoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(this.categoryRepository.create({ ...categoryDto }));
  }

  async createContent(contentDto: CreateCategoryContentDto, categoryId: number) {
    return await this.contentRepository.save(
      this.contentRepository.create({ ...contentDto, category: { id: categoryId } }),
    );
  }

  // UPDATE
  async updateCategory(categoryDto: UpdateCategoryDto, categoryId: number) {
    return await this.categoryRepository.save({ ...categoryDto, id: categoryId });
  }

  async updateContent(contentDto: UpdateCategoryContentDto, contentId: number) {
    return await this.contentRepository.save({ ...contentDto, id: contentId });
  }

  // PARSERS
  parseCategory(category: CategoryEntity) {
    const newCategory: CategoryDto = plainToClass(CategoryDto, category, { excludeExtraneousValues: true });

    if (category.contents && category.contents.length) {
      newCategory.title = category.contents[0].title;
    }

    return newCategory;
  }

  // CHECKERS
  async checkCategoryById(categoryId: number) {
    return this.categoryRepository.findOne({ where: { id: categoryId } });
  }

  async checkContentById(contentId: number) {
    return this.contentRepository.findOne({ where: { id: contentId }, relations: { category: true } });
  }

  async checkContentForExist(categoryId: number, language: LanguageEnum) {
    return this.contentRepository.findOne({ where: { category: { id: categoryId }, language } });
  }
}
