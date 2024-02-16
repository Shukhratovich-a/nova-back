import { Body, Controller, Param, Query, Get, Post, Put, Delete, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { StatusEnum } from "@enums/status.enum";

import { TagService } from "./tag.service";

import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

@Controller("tag")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // GET
  @Get("get-with-count")
  async getAllWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.tagService.findAllWithContents(status, { page, limit });
  }

  @Get("get-one-with-contents/:tagId")
  async getOne(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("tagId", new ParseIntPipe()) tagId: number,
  ) {
    return this.tagService.findOneWithContents(tagId, status);
  }

  // POST
  @Post("create")
  async create(@Body() tagDto: CreateTagDto) {
    return this.tagService.create(tagDto);
  }

  // PUT
  @Put("update/:tagId")
  async update(@Param("tagId", new ParseIntPipe()) tagId: number, @Body() tagDto: UpdateTagDto) {
    const tag = await this.tagService.checkById(tagId);
    if (!tag) return new BadRequestException("tag not exists");

    return this.tagService.update(tagDto, tagId);
  }

  // DELETE
  @Delete("delete/:tagId")
  async delete(@Param("tagId", new ParseIntPipe()) tagId: number) {
    const tag = await this.tagService.checkById(tagId);
    if (!tag) throw new BadRequestException("not found");

    return this.tagService.delete(tagId);
  }
}
