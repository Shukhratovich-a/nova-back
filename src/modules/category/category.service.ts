import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { join } from "path";
import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";
import * as csv from "csvtojson";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { CategoryEntity, CategoryContentEntity } from "./category.entity";

import { CategoryDto } from "./dtos/category.dto";
import { CreateCategoryDto, CreateCategoryContentDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto, UpdateCategoryContentDto } from "./dtos/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryContentEntity) private readonly contentRepository: Repository<CategoryContentEntity>,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, { page, limit }: IPagination) {
    const categories = await this.categoryRepository.find({
      relations: { contents: true },
      where: { contents: { language } },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!categories) return [];

    const parsedCategories: CategoryDto[] = categories.map((category) => {
      return this.parseCategory(category);
    });

    return parsedCategories;
  }

  // CREATE
  async createCategory(categoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(this.categoryRepository.create(categoryDto));
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

  // ASSETS
  async readCategories() {
    const jsonArray = await csv().fromFile(join(process.cwd(), "uploads", "categories.csv"));
    const categories = [...new Set(jsonArray.map((category) => JSON.stringify(category)))].map((category) =>
      JSON.parse(category),
    );

    return { categories, length: categories.length };
  }

  async addCategories() {
    const categories = await this.readCategories();

    categories.categories.forEach(async (category) => {
      const { id } = await this.createCategory({ poster: "", alias: "" });

      await this.createContent({ title: category.ru, language: LanguageEnum.RU }, id);
      await this.createContent({ title: category.en, language: LanguageEnum.EN }, id);
      await this.createContent({ title: category.tr, language: LanguageEnum.TR }, id);
    });

    return true;
  }
}
