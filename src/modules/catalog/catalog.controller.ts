import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from "@nestjs/common";

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
  async createCatalog(@Body(new ValidationPipe()) catalogDto: CreateCatalogDto) {
    const catalog = await this.catalogService.checkCatalogForExist(catalogDto.year, catalogDto.language);
    if (catalog) throw new BadRequestException("exists");

    return this.catalogService.createCatalog(catalogDto);
  }

  // PUT
  @Put("update/:catalogId")
  async updateCatalog(
    @Param("catalogId", new ParseIntPipe()) catalogId: number,
    @Body(new ValidationPipe()) catalogDto: UpdateCatalogDto,
  ) {
    const catalog = await this.catalogService.checkCatalogById(catalogId);
    if (!catalog) throw new BadRequestException("not found");

    const oldCatalog = await this.catalogService.checkCatalogForExistById(
      catalogId,
      catalogDto.year || catalog.year,
      catalogDto.language || catalog.language,
    );
    if (oldCatalog) throw new BadRequestException("exists");

    return this.catalogService.updateCatalog(catalogDto, catalogId);
  }

  // DELETE
  @Delete("delete/:catalogId")
  async deleteCatalog(@Param("catalogId", new ParseIntPipe()) catalogId: number) {
    const catalog = await this.catalogService.checkCatalogById(catalogId);
    if (!catalog) throw new BadRequestException("not found");

    return this.catalogService.deleteCatalog(catalogId);
  }
}
