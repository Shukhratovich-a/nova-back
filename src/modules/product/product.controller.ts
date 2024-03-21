import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { SubcategoryService } from "@modules/subcategory/subcategory.service";
import { ProductService } from "./product.service";

import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Controller("product")
export class ProductController {
  constructor(private readonly subcategoryService: SubcategoryService, private readonly productService: ProductService) {}

  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.productService.findAll(language, { page, limit });
  }

  @Get("search")
  async searchProducts(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("q") searchText: string,
    @Query() { page, limit }: IPagination,
  ) {
    return this.productService.search(language, searchText, { page, limit });
  }

  @Get("get-by-id/:productId")
  async getById(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("productId", new ParseIntPipe()) productId: number,
  ) {
    return this.productService.findById(productId, language);
  }

  @Get("get-by-code/:productCode")
  async getByCode(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("productCode") productCode: string,
  ) {
    return this.productService.findByCode(productCode, language);
  }

  @Get("get-with-count")
  async getAllWithCount(@Query() { page, limit }: IPagination, @Query("code") code: string) {
    return this.productService.findAllWithCount({ page, limit }, code);
  }

  @Get("get-one-with-contents/:productId")
  async getOneWithContents(@Param("productId", new ParseIntPipe()) productId: number) {
    return this.productService.findOneWithContents(productId);
  }

  @Get("get-by-parent/:subcategoryId")
  async getAllByParentId(
    @Query() { page, limit }: IPagination,
    @Param("subcategoryId", new ParseIntPipe()) subcategoryId: number,
  ) {
    return this.productService.findAllByParentId(subcategoryId, { page, limit });
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
