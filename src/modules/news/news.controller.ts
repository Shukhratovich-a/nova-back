import { Body, Controller, Param, Query, Get, Post, Put, Delete, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

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
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.newsService.findAll(language, status, { page, limit });
  }

  @Get("get-by-id/:newsId")
  async getById(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("newsId", new ParseIntPipe()) newsId: number,
  ) {
    return this.newsService.findById(newsId, language, status);
  }

  @Get("get-by-alias/:alias")
  async getByAlias(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("alias") alias: string,
  ) {
    return this.newsService.findByAlias(alias, language, status);
  }

  // POST
  @Post("create-news")
  async createNews(@Body() newsDto: CreateNewsDto) {
    return this.newsService.createNews(newsDto);
  }

  // PUT
  @Put("update-news/:newsId")
  async updateNews(@Param("newsId", new ParseIntPipe()) newsId: number, @Body() newsDto: UpdateNewsDto) {
    const news = await this.newsService.checkById(newsId);
    if (!news) return new BadRequestException("news not exists");

    return this.newsService.updateNews(newsDto, newsId);
  }

  // DELETE
  @Delete("delete/:newsId")
  async delete(@Param("newsId", new ParseIntPipe()) newsId: number) {
    const category = await this.newsService.checkById(newsId);
    if (!category) throw new BadRequestException("not found");

    return this.newsService.delete(newsId);
  }
}
