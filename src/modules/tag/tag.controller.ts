import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";
import { ParseArrayPipe } from "@pipes/array-parse.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { TagService } from "./tag.service";

import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

@Controller("tag")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // GET
  @Get("get-with-count")
  async getAllWithContents(@Query() pagination: IPagination) {
    return this.tagService.findAllWithContents(pagination);
  }

  @Get("get-one-with-contents/:tagId")
  async getOne(@Param("tagId", new ParseIntPipe()) tagId: number) {
    return this.tagService.findOneWithContents(tagId);
  }

  @Get("get-by-language")
  async getByLanguage(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("tags", new ParseArrayPipe()) tags: string[],
  ) {
    return this.tagService.findByLanguage(tags, language);
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
