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

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryContentEntity) private readonly contentRepository: Repository<CategoryContentEntity>,
  ) {}

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

  async createCategory(categoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(this.categoryRepository.create(categoryDto));
  }

  async createContent(contentRepository: CreateCategoryContentDto, categoryId: number) {
    return await this.contentRepository.save(
      this.contentRepository.create({ ...contentRepository, category: { id: categoryId } }),
    );
  }

  // PARSERS
  parseCategory(category: CategoryEntity) {
    const newCategory: CategoryDto = plainToClass(CategoryDto, category, { excludeExtraneousValues: true });

    if (category.contents && category.contents.length) {
      newCategory.title = category.contents[0].title;
    }

    return newCategory;
  }

  async readCategories() {
    const jsonArray = await csv().fromFile(join(process.cwd(), "uploads", "csv.csv"));
    const categories = new Set();
    jsonArray.forEach((product) => {
      categories.add(product.name);
    });

    const array = Array.from(categories);

    return array;
  }

  async addCategories() {
    const categories = [
      "СИФОНЫ ДЛЯ УМЫВАЛЬНИКА / МОЙКИ",
      "ТРУБЫ И МАНЖЕТЫ ДЛЯ ПОДКЛЮЧЕНИЯ КАНАЛИЗАЦИИ",
      "СИФОНЫ ДЛЯ ВАННЫ И ДУШЕВЫХ ПОДДОНОВ",
      "СИДЕНЬЯ ДЛЯ УНИТАЗА",
      "ШЛАНГИ ДЛЯ СТИРАЛЬНОЙ МАШИН",
      "СЛИВНЫЕ БАЧКИ",
      "АРМАТУРЫ ДЛЯ СЛИВНЫХ БАЧКОВ",
      "ТРАПЫ САНТЕХНИЧЕСКИЕ",
      "ДУШЕВЫЕ КАНАЛЫ",
      "ИНСТАЛЛЯЦИЯ САНТЕХНИЧЕСКАЯ",
    ];

    categories.forEach(async (category) => {
      const { id } = await this.createCategory({ poster: "", alias: "" });

      await this.createContent({ title: category, language: LanguageEnum.RU }, id);
    });

    return true;
  }
}
