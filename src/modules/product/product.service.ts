import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FindOptionsWhere, Like, Not, Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

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
  async findAll(language: LanguageEnum, status: StatusEnum, { page = 1, limit = 10 }: IPagination) {
    const [products, total] = await this.productRepository
      .createQueryBuilder("product")
      .where("product.status = :status", { status })
      .take(Number(limit))
      .skip((Number(page) - 1) * Number(limit) || 0)
      .getManyAndCount();
    if (!products) return [];

    const parsedProducts: ProductDto[] = products.map((product) => this.parse(product, language));

    return { data: parsedProducts, total };
  }

  async search(language: LanguageEnum, searchText: string, status: StatusEnum, { page = 1, limit = 10 }: IPagination) {
    const [products, total] = await this.productRepository.findAndCount({
      relations: { subcategory: true },
      where: [
        { code: Like(`%${searchText}%`), status },
        { titleAr: Like(`%${searchText}%`), status },
        { titleEn: Like(`%${searchText}%`), status },
        { titleRu: Like(`%${searchText}%`), status },
        { titleTr: Like(`%${searchText}%`), status },
        { subcategory: { titleAr: Like(`%${searchText}%`), status }, status },
        { subcategory: { titleEn: Like(`%${searchText}%`), status }, status },
        { subcategory: { titleRu: Like(`%${searchText}%`), status }, status },
        { subcategory: { titleTr: Like(`%${searchText}%`), status }, status },
      ],
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit) || 0,
      order: { code: "ASC" },
    });
    if (!products) return [];

    const parsedProducts: ProductDto[] = products.map((product) => this.parse(product, language));

    return { data: parsedProducts, total };
  }

  async findById(productId: number, language: LanguageEnum, status: StatusEnum) {
    const product = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.details", "detail", "detail.status = :status", { status })
      .leftJoinAndSelect("detail.type", "type", "type.status = :status", { status })
      .leftJoinAndSelect("detail.category", "category", "category.status = :status", { status })
      .where("product.id = :id", { id: productId })
      .andWhere("product.status = :status", { status })
      .getOne();
    if (!product) return null;

    const parsedProduct: ProductDto = this.parse(product, language);

    parsedProduct.detailCategories = await this.detailService.sortDetails(product.details, language);
    return parsedProduct;
  }

  async findByCode(productCode: string, language: LanguageEnum, status: StatusEnum) {
    const product = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.subcategory", "subcategory", "subcategory.status = :status", { status })
      .leftJoinAndSelect("subcategory.category", "category", "category.status = :status", { status })
      .leftJoinAndSelect("product.details", "detail", "detail.status = :status", { status })
      .leftJoinAndSelect("detail.type", "type", "type.status = :status", { status })
      .leftJoinAndSelect("detail.category", "detail_category", "detail_category.status = :status", { status })
      .where("product.code = :code", { code: productCode })
      .andWhere("product.status = :status", { status })
      .getOne();
    if (!product) return null;

    const parsedProduct: ProductDto = this.parse(product, language);

    parsedProduct.detailCategories = await this.detailService.sortDetails(product.details, language);
    return parsedProduct;
  }

  async findByAlias(alias: string, language: LanguageEnum, status: StatusEnum) {
    const product = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.details", "detail", "detail.status = :status", { status })
      .leftJoinAndSelect("detail.type", "type", "type.status = :status", { status })
      .leftJoinAndSelect("detail.category", "category", "category.status = :status", { status })
      .where("product.alias = :alias", { alias })
      .andWhere("product.status = :status", { status })
      .getOne();
    if (!product) return null;

    const parsedProduct: ProductDto = this.parse(product, language);

    parsedProduct.detailCategories = await this.detailService.sortDetails(product.details, language);
    return parsedProduct;
  }

  async findAllWithCount(status: StatusEnum, { page, limit }: IPagination, code?: string) {
    const where: Record<string, unknown> = { status };
    if (code) where.code = Like(`%${code}%`);

    const [products, total] = await this.productRepository.findAndCount({
      relations: { subcategory: { category: true } },
      where,
      take: limit,
      skip: (page - 1) * limit || 0,
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

  async findOneWithContents(productId: number, status: StatusEnum) {
    const product = await this.productRepository.findOne({
      relations: { subcategory: { category: true }, details: { type: true, category: true } },
      where: { status, id: productId },
    });
    if (!product) return null;

    if (product.mainImage) product.mainImage = process.env.HOST + product.mainImage;
    if (product.schemeImage) product.schemeImage = process.env.HOST + product.schemeImage;
    if (product.boxImage) product.boxImage = process.env.HOST + product.boxImage;

    return product;
  }

  async findAllByParentId(subcategoryId: number, status: StatusEnum, { page, limit }: IPagination) {
    const [products, total] = await this.productRepository.findAndCount({
      where: { status, subcategory: { id: subcategoryId } },
      take: limit,
      skip: (page - 1) * limit || 0,
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

  // CREATE
  async create(productDto: CreateProductDto) {
    const pdfStatus = await this.pdfService.createProductPdf(productDto);
    if (!pdfStatus) throw new BadRequestException();

    const product = await this.productRepository.save(
      this.productRepository.create({
        ...productDto,
        subcategory: { id: productDto.subcategoryId },
      }),
    );

    if (productDto.details) {
      productDto.details.forEach((detail) => this.detailService.create({ ...detail, productId: product.id }));
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
        details.forEach((detail) => this.detailService.create({ ...detail, productId }));
      }
    }

    return product;
  }

  // DELETE
  async delete(productId: number) {
    return await this.productRepository.save({ status: StatusEnum.DELETED, id: productId });
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
