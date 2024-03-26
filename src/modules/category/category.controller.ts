import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { CategoryService } from "./category.service";

import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    return this.categoryService.findAll(language, pagination);
  }

  // GET
  @Get("get-all-with-children")
  async getAllWithChildren(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    return this.categoryService.findAllWithChildren(language, pagination);
  }

  @Get("get-by-id/:categoryId")
  async getById(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("categoryId", new ParseIntPipe()) categoryId: number,
  ) {
    return this.categoryService.findById(categoryId, language);
  }

  @Get("get-by-alias/:alias")
  async getByAlias(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("alias") alias: string,
  ) {
    return this.categoryService.findByAlias(alias, language);
  }

  @Get("get-with-count")
  async getAllWithContents(@Query() pagination: IPagination) {
    return this.categoryService.findAllWithContents(pagination);
  }

  @Get("get-one-with-contents/:categoryId")
  async getOne(@Param("categoryId", new ParseIntPipe()) categoryId: number) {
    return this.categoryService.findOneWithContents(categoryId);
  }

  // POST
  @Post("create")
  async create(@Body() categoryDto: CreateCategoryDto) {
    return this.categoryService.create(categoryDto);
  }

  // PUT
  @Put("update/:categoryId")
  async update(@Param("categoryId", new ParseIntPipe()) categoryId: number, @Body() categoryDto: UpdateCategoryDto) {
    const category = await this.categoryService.checkById(categoryId);
    if (!category) throw new BadRequestException("not found");

    return this.categoryService.update(categoryDto, categoryId);
  }

  // DELETE
  @Delete("delete/:categoryId")
  async delete(@Param("categoryId", new ParseIntPipe()) categoryId: number) {
    const category = await this.categoryService.checkById(categoryId);
    if (!category) throw new BadRequestException("not found");

    return this.categoryService.delete(categoryId);
  }
}
