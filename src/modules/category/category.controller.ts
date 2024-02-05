import {
  Body,
  Controller,
  Param,
  Query,
  Get,
  Post,
  Put,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

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
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.categoryService.findAll(language, status, { page, limit });
  }

  @Get("get-by-id/:categoryId")
  async getById(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("categoryId", new ParseIntPipe()) categoryId: number,
  ) {
    return this.categoryService.findById(categoryId, language, status);
  }

  @Get("get-by-alias/:alias")
  async getByAlias(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("alias") alias: string,
  ) {
    return this.categoryService.findByAlias(alias, language, status);
  }

  @Get("get-with-contents")
  async getAllWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.categoryService.findAllWithContents(status, { page, limit });
  }

  @Get("get-one-with-contents/:categoryId")
  async getOne(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("categoryId", new ParseIntPipe()) categoryId: number,
  ) {
    return this.categoryService.findOneWithContents(categoryId, status);
  }

  // POST
  @Post("create-category")
  async createCategory(@Body(new ValidationPipe()) categoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(categoryDto);
  }

  // PUT
  @Put("update-category/:categoryId")
  async updateCategory(
    @Param("categoryId", new ParseIntPipe()) categoryId: number,
    @Body(new ValidationPipe()) categoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.checkCategoryById(categoryId);
    if (!category) throw new BadRequestException("not found");

    return this.categoryService.updateCategory(categoryDto, categoryId);
  }

  // DELETE
  @Delete("delete-category/:categoryId")
  async deleteCategory(@Param("categoryId", new ParseIntPipe()) categoryId: number) {
    const category = await this.categoryService.checkCategoryById(categoryId);
    if (!category) throw new BadRequestException("not found");

    return this.categoryService.deleteCategory(categoryId);
  }
}
