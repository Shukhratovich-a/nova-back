import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { SubcategoryEntity, SubcategoryContentEntity } from "./subcategory.entity";

import { CategoryService } from "@modules/category/category.service";
import { ProductService } from "@modules/product/product.service";

import { SubcategoryDto } from "./dtos/subcategory.dto";
import { CreateSubcategoryDto, CreateSubcategoryContentDto } from "./dtos/create-subcategory.dto";
import { UpdateSubcategoryDto, UpdateSubcategoryContentDto } from "./dtos/update-subcategory.dto";

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(SubcategoryEntity) private readonly subcategoryRepository: Repository<SubcategoryEntity>,
    @InjectRepository(SubcategoryContentEntity)
    private readonly contentRepository: Repository<SubcategoryContentEntity>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const subcategories = await this.subcategoryRepository.find({
      relations: { contents: true },
      where: { contents: { language }, status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!subcategories) return [];

    const parsedSubcategories: SubcategoryDto[] = subcategories.map((subcategory) => {
      return this.parseSubcategory(subcategory);
    });

    return parsedSubcategories;
  }

  async findById(subcategoryId: number, language: LanguageEnum, status: StatusEnum) {
    const subcategory = await this.subcategoryRepository.findOne({
      relations: { contents: true, products: { contents: true, images: true }, category: { contents: true } },
      where: {
        id: subcategoryId,
        contents: { language },
        status,
        products: { contents: { language } },
        category: { contents: { language } },
      },
    });
    if (!subcategory) return null;

    const parsedSubcategory: SubcategoryDto = this.parseSubcategory(subcategory);

    parsedSubcategory.products = subcategory.products.map((product) => {
      return this.productService.parseProduct(product);
    });

    parsedSubcategory.category = this.categoryService.parseCategory(subcategory.category);

    return parsedSubcategory;
  }

  // CREATE
  async createSubcategory(subcategoryDto: CreateSubcategoryDto) {
    return await this.subcategoryRepository.save(
      this.subcategoryRepository.create({ ...subcategoryDto, category: { id: subcategoryDto.categoryId } }),
    );
  }

  async createContent(contentDto: CreateSubcategoryContentDto, subcategoryId: number) {
    return await this.contentRepository.save(
      this.contentRepository.create({ ...contentDto, subcategory: { id: subcategoryId } }),
    );
  }

  // UPDATE
  async updateSubcategory(subcategoryDto: UpdateSubcategoryDto, subcategoryId: number) {
    return await this.subcategoryRepository.save({ ...subcategoryDto, id: subcategoryId });
  }

  async updateContent(contentDto: UpdateSubcategoryContentDto, contentId: number) {
    return await this.contentRepository.save({ ...contentDto, id: contentId });
  }

  // PARSERS
  parseSubcategory(subcategory: SubcategoryEntity) {
    const newSubcategory: SubcategoryDto = plainToClass(SubcategoryDto, subcategory, { excludeExtraneousValues: true });

    if (subcategory.contents && subcategory.contents.length) {
      newSubcategory.title = subcategory.contents[0].title;
    }

    return newSubcategory;
  }

  // CHECKERS
  async checkSubcategoryById(subcategoryId: number) {
    return this.subcategoryRepository.findOne({ where: { id: subcategoryId } });
  }

  async checkContentById(contentId: number) {
    return this.contentRepository.findOne({ where: { id: contentId }, relations: { subcategory: true } });
  }

  async checkContentForExist(subcategoryId: number, language: LanguageEnum) {
    return this.contentRepository.findOne({ where: { subcategory: { id: subcategoryId }, language } });
  }
}
