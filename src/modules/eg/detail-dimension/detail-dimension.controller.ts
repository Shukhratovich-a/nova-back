import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { IPagination } from "@interfaces/pagination.interface";

import { DetailDimensionService } from "./detail-dimension.service";

import { CreateDetailDimensionDto } from "./dtos/create-detail-dimension.dto";
import { UpdateDetailDimensionDto } from "./dtos/update-detail-dimension.dto";

@Controller("detail-dimension")
export class DetailDimensionController {
  constructor(private readonly detailDimensionService: DetailDimensionService) {}

  // GET
  @Get("get-with-count")
  async getAllWithCount(@Query() pagination: IPagination) {
    return this.detailDimensionService.findAllWithCount(pagination);
  }

  @Get("get-one-with-contents/:dimensionId")
  async getOneWithContents(@Param("dimensionId", new ParseIntPipe()) dimensionId: number) {
    return this.detailDimensionService.findOneWithContents(dimensionId);
  }

  // POST
  @Post("create")
  async create(@Body() dimensionDto: CreateDetailDimensionDto) {
    return this.detailDimensionService.create(dimensionDto);
  }

  // PUT
  @Put("update/:dimensionId")
  async update(@Param("dimensionId", new ParseIntPipe()) dimensionId: number, @Body() dimensionDto: UpdateDetailDimensionDto) {
    const dimension = await this.detailDimensionService.checkById(dimensionId);
    if (!dimension) throw new BadRequestException("not found");

    return this.detailDimensionService.update(dimensionDto, dimensionId);
  }

  // DELETE
  @Delete("delete/:dimensionId")
  async delete(@Param("dimensionId", new ParseIntPipe()) dimensionId: number) {
    const dimension = await this.detailDimensionService.checkById(dimensionId);
    if (!dimension) throw new BadRequestException("not found");

    return this.detailDimensionService.delete(dimensionId);
  }
}
