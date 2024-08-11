import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { CategoryService } from "@modules/tr/category/category.service";
import { SubcategoryService } from "./subcategory.service";

import { CreateSubcategoryDto } from "./dtos/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dtos/update-subcategory.dto";

@Controller("subcategory")
export class SubcategoryController {
  constructor(private readonly categoryService: CategoryService, private readonly subcategoryService: SubcategoryService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    return this.subcategoryService.findAll(language, pagination);
  }

  @Get("get-by-id/:subcategoryId")
  async getById(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("subcategoryId", new ParseIntPipe()) subcategoryId: number,
  ) {
    return this.subcategoryService.findById(subcategoryId, language);
  }

  @Get("get-by-alias/:alias")
  async getByAlias(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("alias") alias: string,
  ) {
    return this.subcategoryService.findByAlias(alias, language);
  }

  @Get("get-with-count")
  async getAllWithCount(@Query() pagination: IPagination) {
    return this.subcategoryService.findAllWithCount(pagination);
  }

  @Get("get-one-with-contents/:subcategoryId")
  async getOne(@Param("subcategoryId", new ParseIntPipe()) subcategoryId: number) {
    return this.subcategoryService.findOneWithContents(subcategoryId);
  }

  @Get("get-by-parent/:categoryId")
  async getAllByParentId(@Query() pagination: IPagination, @Param("categoryId", new ParseIntPipe()) categoryId: number) {
    return this.subcategoryService.findAllByParentId(categoryId, pagination);
  }

  // POST
  @Post("create")
  async create(@Body() subcategoryDto: CreateSubcategoryDto) {
    const category = await this.categoryService.checkById(subcategoryDto.categoryId);
    if (!category) throw new BadRequestException("category not exists");

    return this.subcategoryService.create(subcategoryDto);
  }

  // PUT
  @Put("update/:subcategoryId")
  async update(@Param("subcategoryId", new ParseIntPipe()) subcategoryId: number, @Body() subcategoryDto: UpdateSubcategoryDto) {
    const subcategory = await this.subcategoryService.checkById(subcategoryId);
    if (!subcategory) throw new BadRequestException("not found");

    return this.subcategoryService.update(subcategoryDto, subcategoryId);
  }

  // DELETE
  @Delete("delete/:subcategoryId")
  async delete(@Param("subcategoryId", new ParseIntPipe()) subcategoryId: number) {
    const subcategory = await this.subcategoryService.checkById(subcategoryId);
    if (!subcategory) throw new BadRequestException("not found");

    return this.subcategoryService.delete(subcategoryId);
  }
}
