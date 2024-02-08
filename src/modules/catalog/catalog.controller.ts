import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { LanguageEnum } from "@enums/language.enum";

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

  // POST
  @Post("create")
  async create(@Body() catalogDto: CreateCatalogDto) {
    const catalog = await this.catalogService.checkForExist(catalogDto.year, catalogDto.language);
    if (catalog) throw new BadRequestException("exists");

    return this.catalogService.create(catalogDto);
  }

  // PUT
  @Put("update/:catalogId")
  async update(@Param("catalogId", new ParseIntPipe()) catalogId: number, @Body() catalogDto: UpdateCatalogDto) {
    const catalog = await this.catalogService.checkById(catalogId);
    if (!catalog) throw new BadRequestException("not found");

    const oldCatalog = await this.catalogService.checkForExistById(
      catalogId,
      catalogDto.year || catalog.year,
      catalogDto.language || catalog.language,
    );
    if (oldCatalog) throw new BadRequestException("exists");

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
