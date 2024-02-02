import {
  Body,
  Controller,
  Param,
  Query,
  Get,
  Post,
  ValidationPipe,
  Put,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { NewsService } from "./news.service";

import { CreateNewsDto, CreateNewsContentDto } from "./dto/create-news.dto";
import { UpdateNewsDto, UpdateNewsContentDto } from "./dto/update-news.dto";

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
  async createNews(@Body(new ValidationPipe()) newsDto: CreateNewsDto) {
    return this.newsService.createNews(newsDto);
  }

  @Post("create-content/:newsId")
  async createContent(
    @Param("newsId", new ParseIntPipe()) newsId: number,
    @Body(new ValidationPipe()) contentDto: CreateNewsContentDto,
  ) {
    const news = await this.newsService.checkNewsById(newsId);
    if (!news) throw new BadRequestException("news not exists");

    const oldContent = await this.newsService.checkContentForExist(newsId, contentDto.language);
    if (oldContent) throw new BadRequestException("content exists");

    return this.newsService.createContent(contentDto, newsId);
  }

  // PUT
  @Put("update-news/:newsId")
  async updateNews(
    @Param("newsId", new ParseIntPipe()) newsId: number,
    @Body(new ValidationPipe()) newsDto: UpdateNewsDto,
  ) {
    const news = await this.newsService.checkNewsById(newsId);
    if (!news) return new BadRequestException("news not exists");

    return this.newsService.updateNews(newsDto, newsId);
  }

  @Put("update-content/:contentId")
  async updateContent(
    @Param("contentId", new ParseIntPipe()) contentId: number,
    @Body(new ValidationPipe()) contentDto: UpdateNewsContentDto,
  ) {
    const content = await this.newsService.checkContentById(contentId);
    if (!content) throw new BadRequestException("content not exists");

    return this.newsService.updateContent(contentDto, contentId);
  }
}
