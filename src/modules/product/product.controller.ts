import { Body, Controller, Param, Query, Get, Post, Put, ParseIntPipe, BadRequestException, Delete } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { SubcategoryService } from "@modules/subcategory/subcategory.service";
import { ProductService } from "./product.service";

import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Controller("product")
export class ProductController {
  constructor(private readonly subcategoryService: SubcategoryService, private readonly productService: ProductService) {}

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

  @Get("get-with-count")
  async getAllWithCount(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
    @Query("code") code: string,
  ) {
    return this.productService.findAllWithCount(status, { page, limit }, code);
  }

  @Get("get-one-with-contents/:productId")
  async getOneWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("productId", new ParseIntPipe()) productId: number,
  ) {
    return this.productService.findOneWithContents(productId, status);
  }

  @Get("get-by-parent/:subcategoryId")
  async getAllByParentId(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
    @Param("subcategoryId", new ParseIntPipe()) subcategoryId: number,
  ) {
    return this.productService.findAllByParentId(subcategoryId, status, { page, limit });
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

    const subcategory = await this.subcategoryService.checkById(productDto.subcategoryId);
    if (!subcategory) throw new BadRequestException("category not exists");

    const product = await this.productService.checkByCode(productDto.code);
    if (product) throw new BadRequestException("product exists");

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
