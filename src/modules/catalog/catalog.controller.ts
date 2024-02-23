import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { CatalogService } from "./catalog.service";

import { CreateCatalogDto } from "./dtos/create-catalog.dto";
import { UpdateCatalogDto } from "./dtos/update-catalog.dto";

@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.catalogService.findAll(language);
  }

  @Get("get-with-count")
  async getAllWithCount(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.catalogService.findAllWithCount(status, { page, limit });
  }

  @Get("get-one-with-contents/:catalogId")
  async getOneWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("catalogId", new ParseIntPipe()) catalogId: number,
  ) {
    return this.catalogService.findOneWithContents(catalogId, status);
  }

  // POST
  @Post("create")
  async create(@Body() catalogDto: CreateCatalogDto) {
    return this.catalogService.create(catalogDto);
  }

  // PUT
  @Put("update/:catalogId")
  async update(@Param("catalogId", new ParseIntPipe()) catalogId: number, @Body() catalogDto: UpdateCatalogDto) {
    const catalog = await this.catalogService.checkById(catalogId);
    if (!catalog) throw new BadRequestException("not found");

    return this.catalogService.update(catalogDto, catalogId);
  }

  // DELETE
  @Delete("delete/:catalogId")
  async delete(@Param("catalogId", new ParseIntPipe()) catalogId: number) {
    const catalog = await this.catalogService.checkById(catalogId);
    if (!catalog) throw new BadRequestException("not found");

    return this.catalogService.delete(catalogId);
  }
}
