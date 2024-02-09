import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { StatusEnum } from "@enums/status.enum";

import { DetailService, DetailCategoryService, DetailTypeService } from "./detail.service";

import { CreateDetailDto, CreateDetailCategoryDto, CreateDetailTypeDto } from "./dtos/create-detail.dto";
import { UpdateDetailDto, UpdateDetailCategoryDto, UpdateDetailTypeDto } from "./dtos/update-detail.dto";

@Controller("detail")
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  // GET
  @Get("get-with-count")
  async getAllWithCount(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.detailService.findAllWithCount(status, { page, limit });
  }

  @Get("get-one-with-contents/:detailId")
  async getOneWithContents(
    @Param("detailId", new ParseIntPipe()) detailId: number,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
  ) {
    return this.detailService.findOneWithContents(detailId, status);
  }

  @Get("get-by-parent/:productId")
  async getAllByParentId(
    @Param("productId", new ParseIntPipe()) productId: number,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.detailService.findAllByParentId(productId, status, { page, limit });
  }

  // POST
  @Post("create")
  async create(@Body() detailDto: CreateDetailDto) {
    return this.detailService.create(detailDto);
  }

  // PUT
  @Put("update/:detailId")
  async update(@Param("detailId", new ParseIntPipe()) detailId: number, @Body() detailDto: UpdateDetailDto) {
    const detail = await this.detailService.checkById(detailId);
    if (!detail) throw new BadRequestException("not found");

    return this.detailService.update(detailDto, detailId);
  }

  // DELETE
  @Delete("delete/:detailId")
  async delete(@Param("detailId", new ParseIntPipe()) detailId: number) {
    const detail = await this.detailService.checkById(detailId);
    if (!detail) throw new BadRequestException("not found");

    return this.detailService.delete(detailId);
  }
}

@Controller("detail-category")
export class DetailCategoryController {
  constructor(private readonly detailCategoryService: DetailCategoryService) {}

  // GET
  @Get("get-with-count")
  async getAllWithCount(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.detailCategoryService.findAllWithCount(status, { page, limit });
  }

  @Get("get-one-with-contents/:categoryId")
  async getOneWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("categoryId", new ParseIntPipe()) categoryId: number,
  ) {
    return this.detailCategoryService.findOneWithContents(categoryId, status);
  }

  // POST
  @Post("create")
  async create(@Body() categoryDto: CreateDetailCategoryDto) {
    return this.detailCategoryService.create(categoryDto);
  }

  // PUT
  @Put("update/:categoryId")
  async update(@Param("categoryId", new ParseIntPipe()) categoryId: number, @Body() categoryDto: UpdateDetailCategoryDto) {
    const category = await this.detailCategoryService.checkById(categoryId);
    if (!category) throw new BadRequestException("not found");

    return this.detailCategoryService.update(categoryDto, categoryId);
  }

  // DELETE
  @Delete("delete/:categoryId")
  async delete(@Param("categoryId", new ParseIntPipe()) categoryId: number) {
    const category = await this.detailCategoryService.checkById(categoryId);
    if (!category) throw new BadRequestException("not found");

    return this.detailCategoryService.delete(categoryId);
  }
}

@Controller("detail-type")
export class DetailTypeController {
  constructor(private readonly detailTypeService: DetailTypeService) {}

  // GET
  @Get("get-with-count")
  async getAllWithCount(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.detailTypeService.findAllWithCount(status, { page, limit });
  }

  @Get("get-one-with-contents/:typeId")
  async getOneWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("typeId", new ParseIntPipe()) typeId: number,
  ) {
    return this.detailTypeService.findOneWithContents(typeId, status);
  }

  // POST
  @Post("create")
  async create(@Body() typeDto: CreateDetailTypeDto) {
    return this.detailTypeService.create(typeDto);
  }

  // PUT
  @Put("update/:typeId")
  async update(@Param("typeId", new ParseIntPipe()) typeId: number, @Body() typeDto: UpdateDetailTypeDto) {
    const type = await this.detailTypeService.checkById(typeId);
    if (!type) throw new BadRequestException("not found");

    return this.detailTypeService.update(typeDto, typeId);
  }

  // DELETE
  @Delete("delete/:typeId")
  async delete(@Param("typeId", new ParseIntPipe()) typeId: number) {
    const type = await this.detailTypeService.checkById(typeId);
    if (!type) throw new BadRequestException("not found");

    return this.detailTypeService.delete(typeId);
  }
}
