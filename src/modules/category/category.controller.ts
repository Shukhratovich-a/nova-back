import { Body, Controller, Param, Query, Get, Post, ValidationPipe } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { CategoryService } from "./category.service";

import { CreateCategoryDto, CreateCategoryContentDto } from "./dtos/create-category.dto";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("get-all")
  getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.categoryService.findAll(language, { page, limit });
  }

  @Post("create-category")
  createCategory(@Body(new ValidationPipe()) categoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(categoryDto);
  }

  @Post("create-content/:categoryId")
  createContent(
    @Body(new ValidationPipe()) contentDto: CreateCategoryContentDto,
    @Param("categoryId") categoryId: number,
  ) {
    return this.categoryService.createContent(contentDto, categoryId);
  }

  @Get("read")
  readDocument() {
    return this.categoryService.readCategories();
  }

  @Get("add-categories")
  addCategories() {
    return this.categoryService.addCategories;
  }
}
