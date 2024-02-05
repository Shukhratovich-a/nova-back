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

import { CategoryService } from "@modules/category/category.service";
import { SubcategoryService } from "./subcategory.service";

import { CreateSubcategoryDto } from "./dtos/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dtos/update-subcategory.dto";

@Controller("subcategory")
export class SubcategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subcategoryService: SubcategoryService,
  ) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.subcategoryService.findAll(language, status, { page, limit });
  }

  @Get("get-by-id/:subcategoryId")
  async getById(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("subcategoryId", new ParseIntPipe()) subcategoryId: number,
  ) {
    return this.subcategoryService.findById(subcategoryId, language, status);
  }

  @Get("get-with-contents")
  async getAllWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.subcategoryService.findAllWithContents(status, { page, limit });
  }

  @Get("get-one-with-contents/:subcategoryId")
  async getOne(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("subcategoryId", new ParseIntPipe()) subcategoryId: number,
  ) {
    return this.subcategoryService.findOneWithContents(subcategoryId, status);
  }

  @Get("get-by-parent/:categoryId")
  async getAllByParentId(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
    @Param("categoryId", new ParseIntPipe()) categoryId: number,
  ) {
    return this.subcategoryService.findAllByParentId(categoryId, status, { page, limit });
  }

  // POST
  @Post("create-subcategory")
  async createCategory(@Body(new ValidationPipe()) subcategoryDto: CreateSubcategoryDto) {
    const category = await this.categoryService.checkCategoryById(subcategoryDto.categoryId);
    if (!category) throw new BadRequestException("category not exists");

    return this.subcategoryService.createSubcategory(subcategoryDto);
  }

  // PUT
  @Put("update-subcategory/:subcategoryId")
  async updateCategory(
    @Param("subcategoryId", new ParseIntPipe()) subcategoryId: number,
    @Body(new ValidationPipe()) subcategoryDto: UpdateSubcategoryDto,
  ) {
    const subcategory = await this.subcategoryService.checkSubcategoryById(subcategoryId);
    if (!subcategory) throw new BadRequestException("not found");

    return this.subcategoryService.updateSubcategory(subcategoryDto, subcategoryId);
  }

  // DELETE
  @Delete("delete-subcategory/:subcategoryId")
  async deleteSubcategory(@Param("subcategoryId", new ParseIntPipe()) subcategoryId: number) {
    const subcategory = await this.subcategoryService.checkSubcategoryById(subcategoryId);
    if (!subcategory) throw new BadRequestException("not found");

    return this.subcategoryService.deleteSubcategory(subcategoryId);
  }
}
