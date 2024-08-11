import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";
import { ParseArrayPipe } from "@pipes/array-parse.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { NewsService } from "./news.service";

import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    return this.newsService.findAll(language, pagination);
  }

  @Get("get-by-id/:newsId")
  async getById(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("newsId", new ParseIntPipe()) newsId: number,
  ) {
    return this.newsService.findById(newsId, language);
  }

  @Get("get-by-alias/:alias")
  async getByAlias(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Param("alias") alias: string,
  ) {
    return this.newsService.findByAlias(alias, language);
  }

  @Get("get-by-tags")
  async getAllByTags(
    @Query("newsId") newsId: number,
    @Query("tags", new ParseArrayPipe()) tags: string[],
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    return this.newsService.findAllByTags(tags, newsId, language, pagination);
  }

  @Get("get-with-count")
  async getAllWithContents(@Query() pagination: IPagination) {
    return this.newsService.findAllWithContents(pagination);
  }

  @Get("get-one-with-contents/:newsId")
  async getOne(@Param("newsId", new ParseIntPipe()) newsId: number) {
    return this.newsService.findOneWithContents(newsId);
  }

  // POST
  @Post("create")
  async createNews(@Body() newsDto: CreateNewsDto) {
    return this.newsService.createNews(newsDto);
  }

  // PUT
  @Put("update/:newsId")
  async updateNews(@Param("newsId", new ParseIntPipe()) newsId: number, @Body() newsDto: UpdateNewsDto) {
    const news = await this.newsService.checkById(newsId);
    if (!news) return new BadRequestException("news not exists");

    return this.newsService.updateNews(newsDto, newsId);
  }

  // DELETE
  @Delete("delete/:newsId")
  async delete(@Param("newsId", new ParseIntPipe()) newsId: number) {
    const news = await this.newsService.checkById(newsId);
    if (!news) throw new BadRequestException("not found");

    return this.newsService.delete(newsId);
  }
}
