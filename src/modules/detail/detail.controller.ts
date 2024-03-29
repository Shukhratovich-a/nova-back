import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { IPagination } from "@interfaces/pagination.interface";

import { DetailService, DetailCategoryService, DetailTypeService } from "./detail.service";

import { CreateDetailDto, CreateDetailCategoryDto, CreateDetailTypeDto } from "./dtos/create-detail.dto";
import { UpdateDetailDto, UpdateDetailCategoryDto, UpdateDetailTypeDto } from "./dtos/update-detail.dto";
import { OrderDetailCategoriesDto } from "./dtos/order-about.dto";

@Controller("detail")
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  // GET
  @Get("get-with-count")
  async getAllWithCount(@Query() pagination: IPagination) {
    return this.detailService.findAllWithCount(pagination);
  }

  @Get("get-one-with-contents/:detailId")
  async getOneWithContents(@Param("detailId", new ParseIntPipe()) detailId: number) {
    return this.detailService.findOneWithContents(detailId);
  }

  @Get("get-by-parent/:productId")
  async getAllByParentId(@Param("productId", new ParseIntPipe()) productId: number, @Query() pagination: IPagination) {
    return this.detailService.findAllByParentId(productId, pagination);
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
  async getAllWithCount(@Query() pagination: IPagination) {
    return this.detailCategoryService.findAllWithCount(pagination);
  }

  @Get("get-one-with-contents/:categoryId")
  async getOneWithContents(@Param("categoryId", new ParseIntPipe()) categoryId: number) {
    return this.detailCategoryService.findOneWithContents(categoryId);
  }

  // POST
  @Post("create")
  async create(@Body() categoryDto: CreateDetailCategoryDto) {
    return this.detailCategoryService.create(categoryDto);
  }

  @Post("order")
  async order(@Body() { data }: OrderDetailCategoriesDto) {
    return this.detailCategoryService.order(data);
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
  async getAllWithCount(@Query() pagination: IPagination) {
    return this.detailTypeService.findAllWithCount(pagination);
  }

  @Get("get-one-with-contents/:typeId")
  async getOneWithContents(@Param("typeId", new ParseIntPipe()) typeId: number) {
    return this.detailTypeService.findOneWithContents(typeId);
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
