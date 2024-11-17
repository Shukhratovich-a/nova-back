import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { InstallationService } from "./installation.service";
import { ProductService } from "@modules/tr/product/product.service";

import { CreateInstallationDto } from "./dtos/create-installation.dto";
import { UpdateInstallationDto } from "./dtos/update-installation.dto";

@Controller("installation")
export class InstallationController {
  constructor(private readonly installationService: InstallationService, private readonly productService: ProductService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    return this.installationService.findAll(language, pagination);
  }

  @Get("get-by-id/:installationId")
  async getById(
    @Param("installationId", new ParseIntPipe()) installationId: number,
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.installationService.findById(installationId, language);
  }

  @Get("get-by-product/:productId")
  async getByProductId(
    @Param("productId", new ParseIntPipe()) productId: number,
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.installationService.findByProductId(productId, language);
  }

  @Get("get-by-product-code/:productCode")
  async getByProductCode(
    @Param("productCode") productCode: string,
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.installationService.findByProductCode(productCode, language);
  }

  @Get("get-with-count")
  async getAllWithCount(@Query() pagination: IPagination) {
    return this.installationService.findAllWithCount(pagination);
  }

  @Get("get-one-with-contents/:installationId")
  async getOne(@Param("installationId", new ParseIntPipe()) installationId: number) {
    return this.installationService.findOneWithContents(installationId);
  }

  @Get("get-by-parent/:installationId")
  async getAllByParentId(@Query() pagination: IPagination, @Param("installationId", new ParseIntPipe()) installationId: number) {
    return this.installationService.findAllByParentId(installationId, pagination);
  }

  // POST
  @Post("create")
  async create(@Body() installationDto: CreateInstallationDto) {
    return this.installationService.create(installationDto);
  }

  // PUT
  @Put("update/:installationId")
  async update(
    @Param("installationId", new ParseIntPipe()) installationId: number,
    @Body() installationDto: UpdateInstallationDto,
  ) {
    const installation = await this.installationService.checkById(installationId);
    if (!installation) throw new BadRequestException("not found");

    return this.installationService.update(installationDto, installationId);
  }

  // DELETE
  @Delete("delete/:installationId")
  async delete(@Param("installationId", new ParseIntPipe()) installationId: number) {
    const installation = await this.installationService.checkById(installationId);
    if (!installation) throw new BadRequestException("not found");

    return this.installationService.delete(installationId);
  }
}
