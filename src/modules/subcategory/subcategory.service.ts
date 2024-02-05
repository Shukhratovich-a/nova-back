import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { SubcategoryEntity } from "./subcategory.entity";

import { CategoryService } from "@modules/category/category.service";
import { ProductService } from "@modules/product/product.service";

import { SubcategoryDto } from "./dtos/subcategory.dto";
import { CreateSubcategoryDto } from "./dtos/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dtos/update-subcategory.dto";

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(SubcategoryEntity) private readonly subcategoryRepository: Repository<SubcategoryEntity>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const subcategories = await this.subcategoryRepository.find({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!subcategories) return [];

    const parsedSubcategories: SubcategoryDto[] = subcategories.map((subcategory) => {
      return this.parseSubcategory(subcategory, language);
    });

    return parsedSubcategories;
  }

  async findById(subcategoryId: number, language: LanguageEnum, status: StatusEnum) {
    const subcategory = await this.subcategoryRepository.findOne({
      relations: { products: { contents: true, images: true } },
      where: {
        id: subcategoryId,
        status,
        products: { contents: { language } },
      },
    });
    if (!subcategory) return null;

    const parsedSubcategory: SubcategoryDto = this.parseSubcategory(subcategory, language);

    parsedSubcategory.products = subcategory.products.map((product) => {
      return this.productService.parseProduct(product);
    });

    parsedSubcategory.category = this.categoryService.parseCategory(subcategory.category, language);

    return parsedSubcategory;
  }

  async findAllWithContents(status: StatusEnum, { page, limit }: IPagination) {
    const [subcategories, total] = await this.subcategoryRepository.findAndCount({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!subcategories) return [];

    return { data: subcategories, total };
  }

  async findOneWithContents(subcategoryId: number, status: StatusEnum) {
    const category = await this.subcategoryRepository.findOne({
      where: { status, id: subcategoryId },
    });
    if (!category) return null;

    return category;
  }

  async findAllByParentId(categoryId: number, status: StatusEnum, { page, limit }: IPagination) {
    const [subcategories, total] = await this.subcategoryRepository.findAndCount({
      where: { status, category: { id: categoryId } },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!subcategories) return [];

    return { data: subcategories, total };
  }

  // CREATE
  async createSubcategory(subcategoryDto: CreateSubcategoryDto) {
    return await this.subcategoryRepository.save(
      this.subcategoryRepository.create({ ...subcategoryDto, category: { id: subcategoryDto.categoryId } }),
    );
  }

  // UPDATE
  async updateSubcategory(subcategoryDto: UpdateSubcategoryDto, subcategoryId: number) {
    return await this.subcategoryRepository.save({ ...subcategoryDto, id: subcategoryId });
  }

  // DELETE
  async deleteSubcategory(subcategoryId: number) {
    return await this.subcategoryRepository.save({ status: StatusEnum.DELETED, id: subcategoryId });
  }

  // PARSERS
  parseSubcategory(subcategory: SubcategoryEntity, language: LanguageEnum) {
    const newSubcategory: SubcategoryDto = plainToClass(SubcategoryDto, subcategory, { excludeExtraneousValues: true });

    if (language === LanguageEnum.RU) newSubcategory.title = subcategory.titleRu;
    if (language === LanguageEnum.EN) newSubcategory.title = subcategory.titleEn;
    if (language === LanguageEnum.TR) newSubcategory.title = subcategory.titleTr;
    if (language === LanguageEnum.AR) newSubcategory.title = subcategory.titleAr;

    return newSubcategory;
  }

  // CHECKERS
  async checkSubcategoryById(subcategoryId: number) {
    return this.subcategoryRepository.findOne({ where: { id: subcategoryId } });
  }
}
