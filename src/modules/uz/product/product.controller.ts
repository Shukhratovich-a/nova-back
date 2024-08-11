import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { SubcategoryService } from "@modules/uz/subcategory/subcategory.service";
import { ProductService } from "./product.service";

import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Controller("product")
export class ProductController {
  constructor(private readonly subcategoryService: SubcategoryService, private readonly productService: ProductService) {}

  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    return this.productService.findAll(language, pagination);
  }

  @Get("get-related/:productId")
  async getRelated(
    @Param("productId") productId: number,
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    const product = await this.productService.checkById(productId);
    if (!product) throw new BadRequestException("not found");

    return this.productService.findRelated(productId, language, pagination);
  }

  @Get("search")
  async searchProducts(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("q") searchText: string,
    @Query() pagination: IPagination,
  ) {
    return this.productService.search(language, searchText, pagination);
  }

  @Get("get-by-id/:productId")
  async getById(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("productId", new ParseIntPipe()) productId: number,
  ) {
    const product = await this.productService.checkById(productId);
    if (!product) throw new BadRequestException("not found");

    return this.productService.findById(productId, language);
  }

  @Get("get-by-code/:productCode")
  async getByCode(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("productCode") productCode: string,
  ) {
    const product = await this.productService.checkByCode(productCode);
    if (!product) throw new BadRequestException("not found");

    return this.productService.findByCode(productCode, language);
  }

  @Get("get-with-count")
  async getAllWithCount(@Query() pagination: IPagination, @Query("code") code: string) {
    return this.productService.findAllWithCount(pagination, code);
  }

  @Get("get-one-with-contents/:productId")
  async getOneWithContents(@Param("productId", new ParseIntPipe()) productId: number) {
    const product = await this.productService.checkById(productId);
    if (!product) throw new BadRequestException("not found");

    return this.productService.findOneWithContents(productId);
  }

  @Get("get-by-parent/:subcategoryId")
  async getAllByParentId(@Query() pagination: IPagination, @Param("subcategoryId", new ParseIntPipe()) subcategoryId: number) {
    const subcategory = await this.subcategoryService.checkById(subcategoryId);
    if (!subcategory) throw new BadRequestException("category not exists");

    return this.productService.findAllByParentId(subcategoryId, pagination);
  }

  // POST
  @Post("create")
  async create(@Body() productDto: CreateProductDto) {
    const subcategory = await this.subcategoryService.checkById(productDto.subcategoryId);
    if (!subcategory) throw new BadRequestException("category not exists");

    const product = await this.productService.checkByCode(productDto.code);
    if (product) throw new BadRequestException("product exists");

    return this.productService.create(productDto);
  }

  // POST
  @Put("update/:productId")
  async update(@Param("productId", new ParseIntPipe()) productId: number, @Body() productDto: UpdateProductDto) {
    const productById = await this.productService.checkById(productId);
    if (!productById) throw new BadRequestException("not found");

    if (productDto.subcategoryId) {
      const subcategory = await this.subcategoryService.checkById(productDto.subcategoryId);
      if (!subcategory) throw new BadRequestException("category not exists");
    }

    if (productDto.code) {
      const product = await this.productService.checkByCode(productDto.code, productId);
      if (product) throw new BadRequestException("product exists");
    }

    return this.productService.update(productDto, productId);
  }

  // DELETE
  @Delete("delete/:productId")
  async delete(@Param("productId", new ParseIntPipe()) productId: number) {
    const product = await this.productService.checkById(productId);
    if (!product) throw new BadRequestException("not found");

    return this.productService.delete(productId);
  }
}
