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
import { StatusEnum } from "@enums/status.enum";

import { SubcategoryService } from "./subcategory.service";

import { CreateSubcategoryDto, CreateSubcategoryContentDto } from "./dtos/create-subcategory.dto";
import { UpdateSubcategoryDto, UpdateSubcategoryContentDto } from "./dtos/update-subcategory.dto";

@Controller("subcategory")
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.subcategoryService.findAll(language, status, { page, limit });
  }

  // POST
  @Post("create-subcategory")
  async createCategory(@Body(new ValidationPipe()) subcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.createSubcategory(subcategoryDto);
  }

  @Post("create-content/:subcategoryId")
  async createContent(
    @Param("subcategoryId", new ParseIntPipe()) subcategoryId: number,
    @Body(new ValidationPipe()) contentDto: CreateSubcategoryContentDto,
  ) {
    const subcategory = await this.subcategoryService.checkSubcategoryById(subcategoryId);
    if (!subcategory) throw new BadRequestException("not found");

    const oldContent = await this.subcategoryService.checkContentForExist(subcategoryId, contentDto.language);
    if (oldContent) throw new BadRequestException("exists");

    return this.subcategoryService.createContent(contentDto, subcategoryId);
  }

  // PUT
  @Put("update-subcategory/:subcategoryId")
  async updateCategory(
    @Param("subcategoryId", new ParseIntPipe()) subcategoryId: number,
    @Body(new ValidationPipe()) subcategoryDto: UpdateSubcategoryDto,
  ) {
    const category = await this.subcategoryService.checkSubcategoryById(subcategoryId);
    if (!category) throw new BadRequestException("not found");

    return this.subcategoryService.updateCategory(subcategoryDto, subcategoryId);
  }

  @Put("update-content/:contentId")
  async updateContent(
    @Param("contentId", new ParseIntPipe()) contentId: number,
    @Body(new ValidationPipe()) contentDto: UpdateSubcategoryContentDto,
  ) {
    const content = await this.subcategoryService.checkContentById(contentId);
    if (!content) throw new BadRequestException("not found");

    return this.subcategoryService.updateContent(contentDto, contentId);
  }
}
