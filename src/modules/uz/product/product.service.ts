import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FindOptionsWhere, Like, Not, Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { ProductEntity } from "./product.entity";

import { SubcategoryService } from "@modules/uz/subcategory/subcategory.service";
import { DetailService } from "@modules/uz/detail/detail.service";
import { PdfService } from "@modules/uz/pdf/pdf.service";

import { ProductDto } from "./dtos/product.dto";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { CreateDetailDto } from "../detail/dtos/create-detail.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity, "db_uz") private readonly productRepository: Repository<ProductEntity>,
    @Inject(forwardRef(() => SubcategoryService)) private readonly subcategorySevice: SubcategoryService,
    @Inject(forwardRef(() => DetailService)) private readonly detailService: DetailService,
    @Inject(forwardRef(() => PdfService)) private readonly pdfService: PdfService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, { page = 1, limit = 10 }: IPagination) {
    const [products, total] = await this.productRepository
      .createQueryBuilder("product")
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    if (!products) return [];

    const parsedProducts: ProductDto[] = await this.parseAll(products, language);

    return { data: parsedProducts, total };
  }

  async findRelated(productId: number, language: LanguageEnum, { page = 1, limit = 10 }: IPagination) {
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

    if (!limit) limit = total;
    const parsedProducts: ProductDto[] = await this.parseAll(products.slice((page - 1) * limit, page * limit), language);

    return { data: parsedProducts, total };
  }

  async search(language: LanguageEnum, searchText: string, { page = 1, limit = 10 }: IPagination) {
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

    const parsedProducts: ProductDto[] = await this.parseAll(products, language);

    return { data: parsedProducts, total };
  }

  async findById(productId: number, language: LanguageEnum) {
    const product = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.subcategory", "subcategory")
      .leftJoinAndSelect("subcategory.category", "category")
      .leftJoinAndSelect("product.details", "detail")
      .leftJoinAndSelect("detail.type", "type")
      .leftJoinAndSelect("detail.category", "detail_category")
      .leftJoinAndSelect("detail.dimension", "dimension")
      .where("product.id = :id", { id: productId })
      .orderBy("category.order", "ASC")
      .addOrderBy("type.order", "ASC")
      .getOne();
    if (!product) return null;

    const parsedProduct: ProductDto = await this.parse(product, language);

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

    const parsedProduct: ProductDto = await this.parse(product, language);

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

    const parsedProduct: ProductDto = await this.parse(product, language);

    return parsedProduct;
  }

  async findAllWithCount({ page = 1, limit = 10 }: IPagination, code?: string) {
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

  async findAllByParentId(subcategoryId: number, { page = 1, limit = 10 }: IPagination) {
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

    const isDetailsCreated = await this.createDetails(details, product.id);

    if (isDetailsCreated) {
      const parsedProductEn = await this.findById(product.id, LanguageEnum.EN);
      const parsedProductRu = await this.findById(product.id, LanguageEnum.RU);
      const parsedProductTr = await this.findById(product.id, LanguageEnum.TR);
      const parsedProductAr = await this.findById(product.id, LanguageEnum.AR);

      await this.pdfService.createProductPdf(parsedProductEn, LanguageEnum.EN);
      await this.pdfService.createProductPdf(parsedProductRu, LanguageEnum.RU);
      await this.pdfService.createProductPdf(parsedProductTr, LanguageEnum.TR);
      await this.pdfService.createProductPdf(parsedProductAr, LanguageEnum.AR);
    }

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
        const isDetailsCreated = await this.createDetails(details, productId);
        console.log(isDetailsCreated);

        if (isDetailsCreated) {
          const parsedProductEn = await this.findById(product.id, LanguageEnum.EN);
          const parsedProductRu = await this.findById(product.id, LanguageEnum.RU);
          const parsedProductTr = await this.findById(product.id, LanguageEnum.TR);
          const parsedProductAr = await this.findById(product.id, LanguageEnum.AR);

          await this.pdfService.createProductPdf(parsedProductEn, LanguageEnum.EN);
          await this.pdfService.createProductPdf(parsedProductRu, LanguageEnum.RU);
          await this.pdfService.createProductPdf(parsedProductTr, LanguageEnum.TR);
          await this.pdfService.createProductPdf(parsedProductAr, LanguageEnum.AR);
        }
      }
    }

    return product;
  }

  // DELETE
  async delete(productId: number) {
    const product = await this.productRepository.delete(productId);

    return product;
  }

  // PARSERS
  async parse(product: ProductEntity, language: LanguageEnum) {
    const newProduct: ProductDto = plainToClass(ProductDto, product, { excludeExtraneousValues: true });

    newProduct.title = product[`title${capitalize(language)}`];
    newProduct.description = product[`description${capitalize(language)}`];

    if (product.subcategory) {
      newProduct.subcategory = this.subcategorySevice.parse(product.subcategory, language);
    }

    if (product.details && product.details.length > 0) {
      newProduct.detailCategories = await this.detailService.sortDetails(product.details, language);
    }

    return newProduct;
  }

  async parseAll(products: ProductEntity[], language: LanguageEnum) {
    const newProducts: ProductDto[] = [];

    for (const product of products) {
      newProducts.push(await this.parse(product, language));
    }

    return newProducts;
  }

  async createDetails(details: CreateDetailDto[], id: number) {
    try {
      for (let i = 0; i < details.length; i++) {
        await this.detailService.create({ ...details[i], productId: id });
      }

      return true;
    } catch {
      return false;
    }
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
