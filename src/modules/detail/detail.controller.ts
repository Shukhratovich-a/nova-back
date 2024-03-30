import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { IPagination } from "@interfaces/pagination.interface";

import { DetailService } from "./detail.service";

import { CreateDetailDto } from "./dtos/create-detail.dto";
import { UpdateDetailDto } from "./dtos/update-detail.dto";

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
