import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FindOptionsWhere, Like, Not, Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { ProductEntity } from "./product.entity";

import { SubcategoryService } from "../subcategory/subcategory.service";
import { DetailService } from "@modules/detail/detail.service";
import { PdfService } from "@modules/pdf/pdf.service";

import { ProductDto } from "./dtos/product.dto";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @Inject(forwardRef(() => SubcategoryService)) private readonly subcategorySevice: SubcategoryService,
    @Inject(forwardRef(() => DetailService)) private readonly detailService: DetailService,
    @Inject(forwardRef(() => PdfService)) private readonly pdfService: PdfService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, { page = 1, limit = 0 }: IPagination) {
    const [products, total] = await this.productRepository
      .createQueryBuilder("product")
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    if (!products) return [];

    const parsedProducts: ProductDto[] = products.map((product) => this.parse(product, language));

    return { data: parsedProducts, total };
  }

  async findRelated(productId: number, language: LanguageEnum, { page = 1, limit = 0 }: IPagination) {
    const product = await this.productRepository.findOne({ where: { id: productId }, relations: { subcategory: true } });
    if (!product.subcategory) return [];

    const [products, total] = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.subcategory", "subcategory")
      .where("product.id != :id", { id: productId })
      .orderBy(`CASE WHEN subcategory.id = ${product.subcategory.id} THEN 0 ELSE 1 END`)
      .addOrderBy("product.code")
      .getManyAndCount();
    if (!products) return [];

    const parsedProducts: ProductDto[] = products.slice((page - 1) * limit, page * limit).map((product) => {
      const newProduct = this.parse(product, language);
      return newProduct;
    });
    return { data: parsedProducts, total };
  }

  async search(language: LanguageEnum, searchText: string, { page = 1, limit = 0 }: IPagination) {
    const [products, total] = await this.productRepository.findAndCount({
      relations: { subcategory: true },
      where: [
        { code: Like(`%${searchText}%`) },
        { titleAr: Like(`%${searchText}%`) },
        { titleEn: Like(`%${searchText}%`) },
        { titleRu: Like(`%${searchText}%`) },
        { titleTr: Like(`%${searchText}%`) },
      ],
      take: limit,
      skip: (page - 1) * limit,
      order: { code: "ASC" },
    });
    if (!products) return [];

    const parsedProducts: ProductDto[] = products.map((product) => this.parse(product, language));

    return { data: parsedProducts, total };
  }

  async findById(productId: number, language: LanguageEnum) {
    const product = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.details", "detail")
      .leftJoinAndSelect("detail.type", "type")
      .leftJoinAndSelect("detail.category", "category")
      .leftJoinAndSelect("detail.dimension", "dimension")
      .where("product.id = :id", { id: productId })
      .orderBy("category.order", "ASC")
      .addOrderBy("type.order", "ASC")
      .getOne();
    if (!product) return null;

    const parsedProduct: ProductDto = this.parse(product, language);

    parsedProduct.detailCategories = await this.detailService.sortDetails(product.details, language);
    return parsedProduct;
  }

  async findByCode(productCode: string, language: LanguageEnum) {
    const product = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.subcategory", "subcategory")
      .leftJoinAndSelect("subcategory.category", "category")
      .leftJoinAndSelect("product.details", "detail")
      .leftJoinAndSelect("detail.type", "type")
      .leftJoinAndSelect("detail.category", "detail_category")
      .leftJoinAndSelect("detail.dimension", "dimension")
      .where("product.code = :code", { code: productCode })
      .orderBy("category.order", "ASC")
      .addOrderBy("type.order", "ASC")
      .getOne();
    if (!product) return null;

    const parsedProduct: ProductDto = this.parse(product, language);

    parsedProduct.detailCategories = await this.detailService.sortDetails(product.details, language);
    return parsedProduct;
  }

  async findByAlias(alias: string, language: LanguageEnum) {
    const product = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.details", "detail")
      .leftJoinAndSelect("detail.type", "type")
      .leftJoinAndSelect("detail.category", "category")
      .leftJoinAndSelect("detail.dimension", "dimension")
      .where("product.alias = :alias", { alias })
      .orderBy("category.order", "ASC")
      .addOrderBy("type.order", "ASC")
      .getOne();
    if (!product) return null;

    const parsedProduct: ProductDto = this.parse(product, language);

    parsedProduct.detailCategories = await this.detailService.sortDetails(product.details, language);
    return parsedProduct;
  }

  async findAllWithCount({ page = 1, limit = 0 }: IPagination, code?: string) {
    const where: Record<string, unknown> = {};
    if (code) where.code = Like(`%${code}%`);

    const [products, total] = await this.productRepository.findAndCount({
      relations: { subcategory: { category: true } },
      where,
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!products) return [];

    return {
      data: products.map((product) => {
        if (product.mainImage) product.mainImage = process.env.HOST + product.mainImage;
        if (product.schemeImage) product.schemeImage = process.env.HOST + product.schemeImage;
        if (product.boxImage) product.boxImage = process.env.HOST + product.boxImage;

        return product;
      }),
      total,
    };
  }

  async findOneWithContents(productId: number) {
    const product = await this.productRepository.findOne({
      relations: { subcategory: { category: true }, details: { type: true, category: true, dimension: true } },
      where: { id: productId },
      order: { details: { category: { order: "ASC" }, type: { order: "ASC" } } },
    });
    if (!product) return null;

    if (product.mainImage) product.mainImage = process.env.HOST + product.mainImage;
    if (product.schemeImage) product.schemeImage = process.env.HOST + product.schemeImage;
    if (product.boxImage) product.boxImage = process.env.HOST + product.boxImage;

    return product;
  }

  async findAllByParentId(subcategoryId: number, { page = 1, limit = 0 }: IPagination) {
    const [products, total] = await this.productRepository.findAndCount({
      where: { subcategory: { id: subcategoryId } },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!products) return [];

    return {
      data: products.map((product) => {
        if (product.mainImage) product.mainImage = process.env.HOST + product.mainImage;
        if (product.schemeImage) product.schemeImage = process.env.HOST + product.schemeImage;
        if (product.boxImage) product.boxImage = process.env.HOST + product.boxImage;

        return product;
      }),
      total,
    };
  }

  async findAllOrderCategory() {
    const products = await this.productRepository.find({
      relations: { subcategory: { category: true }, details: { type: true } },
      order: { subcategory: { category: { order: "ASC" } } },
    });
    if (!products) return [];

    return products.map((product) => {
      if (product.mainImage) product.mainImage = process.env.HOST + product.mainImage;
      if (product.schemeImage) product.schemeImage = process.env.HOST + product.schemeImage;
      if (product.boxImage) product.boxImage = process.env.HOST + product.boxImage;

      return product;
    });
  }

  // CREATE
  async create({ details, ...productDto }: CreateProductDto) {
    const product = await this.productRepository.save(
      this.productRepository.create({
        ...productDto,
        subcategory: { id: productDto.subcategoryId },
      }),
    );
    if (details) {
      details.forEach((detail) => this.detailService.create({ ...detail, productId: product.id }));
    }

    const newProduct = await this.productRepository.findOne({
      where: { id: product.id },
      relations: { details: { category: true, dimension: true, type: true } },
    });
    const parsedProduct = this.parse(newProduct, LanguageEnum.EN);
    parsedProduct.detailCategories = await this.detailService.sortDetails(newProduct.details, LanguageEnum.EN);

    const isPdfCreated = await this.pdfService.createProductPdf(parsedProduct);
    if (!isPdfCreated) throw new BadRequestException();

    return product;
  }

  // UPDATE
  async update({ details, ...productDto }: UpdateProductDto, productId: number) {
    const product = await this.productRepository.save({
      ...productDto,
      id: productId,
      subcategory: { id: productDto.subcategoryId },
    });

    if (details) {
      if (await this.detailService.deleteByParent(productId)) {
        details.forEach((detail) => this.detailService.create({ ...detail, productId }));
      }
    }

    const newProduct = await this.productRepository.findOne({
      where: { id: product.id },
      relations: { details: { category: true, dimension: true, type: true } },
    });
    const parsedProduct = this.parse(newProduct, LanguageEnum.EN);
    parsedProduct.detailCategories = await this.detailService.sortDetails(newProduct.details, LanguageEnum.EN);

    const isPdfCreated = await this.pdfService.createProductPdf(parsedProduct);
    if (!isPdfCreated) throw new BadRequestException();

    return product;
  }

  // DELETE
  async delete(productId: number) {
    return await this.productRepository.delete(productId);
  }

  // PARSERS
  parse(product: ProductEntity, language: LanguageEnum) {
    const newProduct: ProductDto = plainToClass(ProductDto, product, { excludeExtraneousValues: true });

    newProduct.title = product[`title${capitalize(language)}`];
    newProduct.description = product[`description${capitalize(language)}`];

    if (product.subcategory) {
      newProduct.subcategory = this.subcategorySevice.parse(product.subcategory, language);
    }

    return newProduct;
  }

  // CHECKERS
  async checkById(productId: number) {
    return this.productRepository.findOne({ where: { id: productId } });
  }

  async checkByCode(productCode: string, productId?: number) {
    const where: FindOptionsWhere<ProductEntity> = { code: productCode };
    if (productId) where.id = Not(productId);

    return this.productRepository.findOne({ where });
  }
}
