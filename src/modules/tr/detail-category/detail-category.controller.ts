import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { IPagination } from "@interfaces/pagination.interface";

import { DetailCategoryService } from "./detail-category.service";

import { CreateDetailCategoryDto } from "./dtos/create-detail-category.dto";
import { UpdateDetailCategoryDto } from "./dtos/update-detail-category.dto";
import { OrderDetailCategoriesDto } from "./dtos/order-detail-category.dto";

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
