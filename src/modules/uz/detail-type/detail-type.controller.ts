import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { IPagination } from "@interfaces/pagination.interface";

import { DetailTypeService } from "./detail-type.service";

import { CreateDetailTypeDto } from "./dtos/create-detail-type.dto";
import { UpdateDetailTypeDto } from "./dtos/update-detail-type.dto";
import { OrderDetailTypesDto } from "./dtos/order-detail-type.dto";

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

  @Post("order")
  async order(@Body() { data }: OrderDetailTypesDto) {
    return this.detailTypeService.order(data);
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
