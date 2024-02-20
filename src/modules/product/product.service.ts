import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Like, Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { capitalize } from "@/utils/capitalize.utils";

import { ProductEntity } from "./product.entity";

import { DetailService } from "@modules/detail/detail.service";

import { ProductDto } from "./dtos/product.dto";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @Inject(forwardRef(() => DetailService)) private readonly detailService: DetailService,
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

    return { data: products, total };
  }

  async findOneWithContents(productId: number, status: StatusEnum) {
    const product = await this.productRepository.findOne({
      relations: { subcategory: { category: true }, details: { type: true, category: true } },
      where: { status, id: productId },
    });
    if (!product) return null;

    return product;
  }

  async findAllByParentId(subcategoryId: number, status: StatusEnum, { page, limit }: IPagination) {
    const [products, total] = await this.productRepository.findAndCount({
      where: { status, subcategory: { id: subcategoryId } },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!products) return [];

    return { data: products, total };
  }

  // CREATE
  async create(productDto: CreateProductDto) {
    return await this.productRepository.save(
      this.productRepository.create({ ...productDto, subcategory: { id: productDto.subcategoryId } }),
    );
  }

  // UPDATE
  async update(productDto: UpdateProductDto, productId: number) {
    return await this.productRepository.save({
      ...productDto,
      id: productId,
      subcategory: { id: productDto.subcategoryId },
    });
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

    return newProduct;
  }

  // CHECKERS
  async checkById(productId: number) {
    return this.productRepository.findOne({ where: { id: productId } });
  }

  async checkByCode(productCode: string) {
    return this.productRepository.findOne({ where: { code: productCode } });
  }
}
