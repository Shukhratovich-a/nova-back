import { Inject, Injectable, forwardRef, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { SubcategoryEntity } from "./subcategory.entity";

import { CategoryService } from "@modules/tr/category/category.service";
import { ProductService } from "@modules/tr/product/product.service";
import { CronService } from "@modules/tr/cron/cron.service";

import { SubcategoryDto } from "./dtos/subcategory.dto";
import { CreateSubcategoryDto } from "./dtos/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dtos/update-subcategory.dto";
import { OrderSubcategoryDto } from "./dtos/order-subcategory.dto";

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(SubcategoryEntity, "db_tr") private readonly subcategoryRepository: Repository<SubcategoryEntity>,
    @Inject(forwardRef(() => CategoryService)) private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => ProductService)) private readonly productService: ProductService,
    @Inject(forwardRef(() => CronService)) private readonly cronService: CronService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, { page = 1, limit = 0 }: IPagination) {
    const [subcategories, total] = await this.subcategoryRepository
      .createQueryBuilder("subcategory")
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    if (!subcategories) return [];
    const parsedSubcategories: SubcategoryDto[] = subcategories.map((subcategory) => {
      return this.parse(subcategory, language);
    });

    return { data: parsedSubcategories, total };
  }

  async findById(subcategoryId: number, language: LanguageEnum) {
    const subcategory = await this.subcategoryRepository
      .createQueryBuilder("subcategory")
      .leftJoinAndSelect("subcategory.products", "product")
      .leftJoinAndSelect("subcategory.category", "category")
      .where("subcategory.id = :id", { id: subcategoryId })
      .getOne();
    if (!subcategory) return null;

    const parsedSubcategory: SubcategoryDto = this.parse(subcategory, language);
    parsedSubcategory.products = await this.productService.parseAll(subcategory.products, language);

    return parsedSubcategory;
  }

  async findByAlias(alias: string, language: LanguageEnum) {
    const subcategory = await this.subcategoryRepository
      .createQueryBuilder("subcategory")
      .leftJoinAndSelect("subcategory.products", "product")
      .leftJoinAndSelect("subcategory.category", "category")
      .where("subcategory.alias = :alias", { alias })
      .getOne();
    if (!subcategory) return null;

    const parsedSubcategory: SubcategoryDto = this.parse(subcategory, language);
    parsedSubcategory.products = await this.productService.parseAll(subcategory.products, language);
    parsedSubcategory.category = this.categoryService.parse(subcategory.category, language);

    return parsedSubcategory;
  }

  async findAllWithCount({ page = 1, limit = 0 }: IPagination) {
    const [subcategories, total] = await this.subcategoryRepository.findAndCount({
      relations: { category: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!subcategories) return [];

    return {
      data: subcategories.map((subcategory) => {
        subcategory.poster = process.env.HOST + subcategory.poster;

        return subcategory;
      }),
      total,
    };
  }

  async findOneWithContents(subcategoryId: number) {
    const category = await this.subcategoryRepository.findOne({
      relations: { category: true },
      where: { id: subcategoryId },
    });
    if (!category) return null;

    category.poster = process.env.HOST + category.poster;

    return category;
  }

  async findAllByParentId(categoryId: number, { page = 1, limit = 0 }: IPagination) {
    const [subcategories, total] = await this.subcategoryRepository.findAndCount({
      relations: { category: true },
      where: { category: { id: categoryId } },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!subcategories) return [];

    return {
      data: subcategories.map((subcategory) => {
        subcategory.poster = process.env.HOST + subcategory.poster;
        subcategory.category.poster = process.env.HOST + subcategory.category.poster;

        return subcategory;
      }),
      total,
    };
  }

  // ORDER
  async order(subcategories: OrderSubcategoryDto[]) {
    try {
      for (const { id, order } of subcategories) {
        const currentTag = await this.subcategoryRepository.find({ where: { id } });
        if (!currentTag) continue;

        await this.subcategoryRepository.save({ order, id });
      }

      return { success: true };
    } catch {
      throw new BadRequestException();
    }
  }

  // CREATE
  async create(subcategoryDto: CreateSubcategoryDto) {
    const subcategory = await this.subcategoryRepository.save(
      this.subcategoryRepository.create({ ...subcategoryDto, category: { id: subcategoryDto.categoryId } }),
    );

    const { alias } = await this.categoryService.checkById(subcategoryDto.categoryId);
    this.cronService.sendRequest(`/category/${alias}`);

    return subcategory;
  }

  // UPDATE
  async update(subcategoryDto: UpdateSubcategoryDto, subcategoryId: number) {
    const subcategory = await this.subcategoryRepository.save({
      ...subcategoryDto,
      id: subcategoryId,
      category: { id: subcategoryDto.categoryId },
    });

    const { alias } = await this.categoryService.checkById(subcategoryDto.categoryId);
    this.cronService.sendRequest(`/category/${alias}`);

    return subcategory;
  }

  // DELETE
  async delete(subcategoryId: number) {
    const {
      category: { alias },
    } = await this.findById(subcategoryId, LanguageEnum.EN);

    const subcategory = await this.subcategoryRepository.delete(subcategoryId);

    this.cronService.sendRequest(`/category/${alias}`);

    return subcategory;
  }

  // PARSERS
  parse(subcategory: SubcategoryEntity, language: LanguageEnum) {
    const newSubcategory: SubcategoryDto = plainToClass(SubcategoryDto, subcategory, { excludeExtraneousValues: true });

    newSubcategory.title = subcategory[`title${capitalize(language)}`];

    if (subcategory.category) {
      newSubcategory.category = this.categoryService.parse(subcategory.category, language);
    }

    return newSubcategory;
  }

  // CHECKERS
  async checkById(subcategoryId: number) {
    return this.subcategoryRepository.findOne({ where: { id: subcategoryId } });
  }
}
