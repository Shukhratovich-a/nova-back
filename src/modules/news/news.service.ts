import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { NewsEntity, NewsContentEntity } from "./news.entity";

import { NewsDto } from "./dto/news.dto";
import { CreateNewsDto, CreateNewsContentDto } from "./dto/create-news.dto";
import { UpdateNewsDto, UpdateNewsContentDto } from "./dto/update-news.dto";

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
    @InjectRepository(NewsContentEntity)
    private readonly contentRepository: Repository<NewsContentEntity>,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const news = await this.newsRepository.find({
      relations: { contents: true },
      where: { contents: { language }, status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!news) return [];

    const parsedNews: NewsDto[] = news.map((item) => {
      return this.parseNews(item);
    });

    return parsedNews;
  }

  async findById(newsId: number, language: LanguageEnum, status: StatusEnum) {
    const news = await this.newsRepository.findOne({
      relations: { contents: true },
      where: { id: newsId, contents: { language }, status },
    });
    if (!news) return [];

    const parsedNews: NewsDto = this.parseNews(news);

    return parsedNews;
  }

  async findByAlias(alias: string, language: LanguageEnum, status: StatusEnum) {
    const news = await this.newsRepository.findOne({
      relations: { contents: true },
      where: { alias: alias, contents: { language }, status },
    });
    if (!news) return [];

    const parsedNews: NewsDto = this.parseNews(news);

    return parsedNews;
  }

  // CREATE
  async createNews(newsDto: CreateNewsDto) {
    return this.newsRepository.save(this.newsRepository.create({ ...newsDto }));
  }

  async createContent(contentDto: CreateNewsContentDto, newsId: number) {
    return this.contentRepository.save(this.contentRepository.create({ ...contentDto, news: { id: newsId } }));
  }

  // UPDATE
  async updateNews(newsDto: UpdateNewsDto, newsId: number) {
    return this.newsRepository.save({ ...newsDto, id: newsId });
  }

  async updateContent(contentDto: UpdateNewsContentDto, contentId: number) {
    return this.contentRepository.save({ ...contentDto, id: contentId });
  }

  // PARSERS
  parseNews(news: NewsEntity) {
    const newNews: NewsDto = plainToClass(NewsDto, news, { excludeExtraneousValues: true });

    if (news.contents && news.contents.length) {
      newNews.title = news.contents[0].title;
      newNews.subtitle = news.contents[0].subtitle;
      newNews.body = news.contents[0].body;
      newNews.tag = news.contents[0].tag;
    }

    return newNews;
  }

  // CHECKERS
  async checkNewsById(newsId: number) {
    return this.newsRepository.findOne({ where: { id: newsId } });
  }

  async checkContentById(contentId: number) {
    return this.contentRepository.findOne({ where: { id: contentId } });
  }

  async checkContentForExist(newsId: number, language: LanguageEnum) {
    return this.contentRepository.findOne({ where: { news: { id: newsId }, language } });
  }
}
