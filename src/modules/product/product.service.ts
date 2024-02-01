import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { ImageTypeEnum } from "@enums/image-type.enum";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { ProductEntity, ProductContentEntity, ProductImageEntity } from "./product.entity";

import { DetailService } from "../detail/detail.service";

import { ProductDto, ProductImageDto } from "./dtos/product.dto";
import { CreateProductDto, CreateProductContentDto, CreateProductImageDto } from "./dtos/create-product.dto";
import { UpdateProductDto, UpdateProductContentDto, UpdateProductImageDto } from "./dtos/update-product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductContentEntity) private readonly contentRepository: Repository<ProductContentEntity>,
    @InjectRepository(ProductImageEntity) private readonly imageRepository: Repository<ProductImageEntity>,
    @Inject(forwardRef(() => DetailService)) private readonly detailService: DetailService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const products = await this.productRepository.find({
      relations: { contents: true, images: true },
      where: { contents: { language }, status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!products) return [];

    const parsedProducts: ProductDto[] = products.map((product) => this.parseProduct(product));

    return parsedProducts;
  }

  async findById(productId: number, language: LanguageEnum, status: StatusEnum) {
    const product = await this.productRepository.findOne({
      relations: { contents: true, images: true },
      where: { id: productId, contents: { language }, status },
    });
    if (!product) return null;

    const parsedProduct: ProductDto = this.parseProduct(product);

    const details = await this.detailService.findDetailsById(product.id, language);
    parsedProduct.detailCategories = await this.detailService.sortDetails(details, language);
    return parsedProduct;
  }

  // CREATE
  async createProduct(productDto: CreateProductDto) {
    return await this.productRepository.save(
      this.productRepository.create({ ...productDto, subcategory: { id: productDto.subcategoryId } }),
    );
  }

  async createContent(contentDto: CreateProductContentDto, productId: number) {
    return await this.contentRepository.save(
      this.contentRepository.create({ ...contentDto, product: { id: productId } }),
    );
  }

  async createImage(imageDto: CreateProductImageDto, productId: number) {
    return await this.imageRepository.save(this.imageRepository.create({ ...imageDto, product: { id: productId } }));
  }

  // UPDATE
  async updateProduct(productDto: UpdateProductDto, productId: number) {
    return await this.productRepository.save({
      ...productDto,
      id: productId,
      subcategory: { id: productDto.subcategoryId },
    });
  }

  async updateContent(contentDto: UpdateProductContentDto, contentId: number) {
    return await this.contentRepository.save({ ...contentDto, id: contentId });
  }

  async updateImage(imageDto: UpdateProductImageDto, imageId: number) {
    return await this.imageRepository.save({ ...imageDto, id: imageId });
  }

  // PARSERS
  parseProduct(product: ProductEntity) {
    const newProduct: ProductDto = plainToClass(ProductDto, product, { excludeExtraneousValues: true });

    if (product.contents && product.contents.length) {
      newProduct.title = product.contents[0].title;
      newProduct.description = product.contents[0].description;
    }

    if (product.images && product.images.length) {
      newProduct.images = product.images.map((image) => this.parseImage(image));
    }

    return newProduct;
  }

  parseImage(image: ProductImageEntity) {
    return plainToClass(ProductImageDto, image, { excludeExtraneousValues: true });
  }

  // CHECKERS
  async checkProductById(productId: number) {
    return this.productRepository.findOne({ where: { id: productId } });
  }

  async checkContentById(contentId: number) {
    return this.contentRepository.findOne({ where: { id: contentId }, relations: { product: true } });
  }

  async checkImageById(imageId: number) {
    return this.imageRepository.findOne({ where: { id: imageId }, relations: { product: true } });
  }

  async checkContentForExist(productId: number, language: LanguageEnum) {
    return this.contentRepository.findOne({ where: { product: { id: productId }, language } });
  }

  async checkImageForExist(productId: number, type: ImageTypeEnum) {
    return this.imageRepository.findOne({ where: { product: { id: productId }, type } });
  }
}
