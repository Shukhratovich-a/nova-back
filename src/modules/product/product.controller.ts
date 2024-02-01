import {
  Body,
  Controller,
  Param,
  Query,
  Get,
  Post,
  ValidationPipe,
  Put,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { SubcategoryService } from "@modules/subcategory/subcategory.service";
import { ProductService } from "./product.service";

import { CreateProductDto, CreateProductContentDto, CreateProductImageDto } from "./dtos/create-product.dto";
import { UpdateProductDto, UpdateProductContentDto, UpdateProductImageDto } from "./dtos/update-product.dto";

@Controller("product")
export class ProductController {
  constructor(
    private readonly subcategoryService: SubcategoryService,
    private readonly productService: ProductService,
  ) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.productService.findAll(language, status, { page, limit });
  }

  @Get("get-by-id/:productId")
  async getById(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("productId", new ParseIntPipe()) productId: number,
  ) {
    return this.productService.findById(productId, language, status);
  }

  // POST
  @Post("create-product")
  async createProduct(@Body(new ValidationPipe()) productDto: CreateProductDto) {
    const subcategory = await this.subcategoryService.checkSubcategoryById(productDto.subcategoryId);
    if (!subcategory) throw new BadRequestException("category not exists");

    const product = await this.productService.checkProductByCode(productDto.code);
    if (product) throw new BadRequestException("product exists");

    return this.productService.createProduct(productDto);
  }

  @Post("create-content/:productId")
  async createContent(
    @Param("productId", new ParseIntPipe()) productId: number,
    @Body(new ValidationPipe()) contentDto: CreateProductContentDto,
  ) {
    const product = await this.productService.checkProductById(productId);
    if (!product) throw new BadRequestException("not found");

    const oldContent = await this.productService.checkContentForExist(productId, contentDto.language);
    if (oldContent) throw new BadRequestException("exists");

    return this.productService.createContent(contentDto, productId);
  }

  @Post("create-image/:productId")
  async createImage(
    @Param("productId", new ParseIntPipe()) productId: number,
    @Body(new ValidationPipe()) imageDto: CreateProductImageDto,
  ) {
    const product = await this.productService.checkProductById(productId);
    if (!product) throw new BadRequestException("not found");

    const oldImage = await this.productService.checkImageForExist(productId, imageDto.type);
    if (oldImage) throw new BadRequestException("exists");

    return this.productService.createImage(imageDto, productId);
  }

  // PUT
  @Put("update-product/:productId")
  async updateProduct(
    @Param("productId", new ParseIntPipe()) productId: number,
    @Body(new ValidationPipe()) productDto: UpdateProductDto,
  ) {
    const product = await this.productService.checkProductById(productId);
    if (!product) throw new BadRequestException("product not exists");

    const subcategory = await this.subcategoryService.checkSubcategoryById(productDto.subcategoryId);
    if (!subcategory) throw new BadRequestException("category not exists");

    return this.productService.updateProduct(productDto, productId);
  }

  @Put("update-content/:contentId")
  async updateContent(
    @Param("contentId", new ParseIntPipe()) contentId: number,
    @Body(new ValidationPipe()) contentDto: UpdateProductContentDto,
  ) {
    const content = await this.productService.checkContentById(contentId);
    if (!content) throw new BadRequestException("not found");

    return this.productService.updateContent(contentDto, contentId);
  }

  @Put("update-image/:imageId")
  async updateImage(@Param("imageId", new ParseIntPipe()) imageId: number, @Body() imageDto: UpdateProductImageDto) {
    const image = await this.productService.checkImageById(imageId);
    if (!image) throw new BadRequestException("not found");

    return this.productService.updateImage(imageDto, imageId);
  }
}
