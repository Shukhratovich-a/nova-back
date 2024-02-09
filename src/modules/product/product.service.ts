import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
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
  async findAll(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const products = await this.productRepository.find({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!products) return [];

    const parsedProducts: ProductDto[] = products.map((product) => this.parse(product, language));

    return parsedProducts;
  }

  async findById(productId: number, language: LanguageEnum, status: StatusEnum) {
    const product = await this.productRepository.findOne({
      relations: { details: { type: true, category: true } },
      where: { id: productId, status },
    });
    if (!product) return null;

    const parsedProduct: ProductDto = this.parse(product, language);

    parsedProduct.detailCategories = await this.detailService.sortDetails(product.details, language);
    return parsedProduct;
  }

  async findAllWithCount(status: StatusEnum, { page, limit }: IPagination) {
    const [products, total] = await this.productRepository.findAndCount({
      relations: { subcategory: { category: true } },
      where: { status },
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
