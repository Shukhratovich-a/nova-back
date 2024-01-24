import {
  Body,
  Controller,
  Param,
  Query,
  Get,
  Post,
  ValidationPipe,
  Put,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { CategoryService } from "./category.service";

import { CreateCategoryDto, CreateCategoryContentDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto, UpdateCategoryContentDto } from "./dtos/update-category.dto";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.categoryService.findAll(language, { page, limit });
  }

  // POST
  @Post("create-category")
  async createCategory(@Body(new ValidationPipe()) categoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(categoryDto);
  }

  @Post("create-content/:categoryId")
  async createContent(
    @Param("categoryId", new ParseIntPipe()) categoryId: number,
    @Body(new ValidationPipe()) contentDto: CreateCategoryContentDto,
  ) {
    const category = await this.categoryService.checkCategoryById(categoryId);
    if (!category) throw new BadRequestException("not found");

    const oldContent = await this.categoryService.checkContentForExist(categoryId, contentDto.language);
    if (oldContent) throw new BadRequestException("exists");

    return this.categoryService.createContent(contentDto, categoryId);
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

  @Put("update-content/:contentId")
  async updateContent(
    @Param("contentId", new ParseIntPipe()) contentId: number,
    @Body(new ValidationPipe()) contentDto: UpdateCategoryContentDto,
  ) {
    const content = await this.categoryService.checkContentById(contentId);
    if (!content) throw new BadRequestException("not found");

    return this.categoryService.updateContent(contentDto, contentId);
  }

  // ASSETS
  @Get("read")
  async readDocument() {
    return this.categoryService.readCategories();
  }

  @Get("add-categories")
  async addCategories() {
    return this.categoryService.addCategories();
  }
}
