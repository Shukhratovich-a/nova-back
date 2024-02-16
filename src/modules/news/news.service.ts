import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { NewsEntity } from "./news.entity";

import { NewsDto } from "./dto/news.dto";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { capitalize } from "@/utils/capitalize.utils";

@Injectable()
export class NewsService {
  constructor(@InjectRepository(NewsEntity) private readonly newsRepository: Repository<NewsEntity>) {}

  // FIND
  async findAll(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const [news, total] = await this.newsRepository.findAndCount({
      relations: { tags: true },
      where: [{ status }, { tags: { status } }],
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!news) return [];

    const parsedNews: NewsDto[] = news.map((item) => {
      const newItem = this.parseNews(item, language);

      newItem.tags = item.tags.map((tag) => tag[`title${capitalize(language)}`]);

      return newItem;
    });

    return { data: parsedNews, total };
  }

  async findById(newsId: number, language: LanguageEnum, status: StatusEnum) {
    const news = await this.newsRepository.findOne({
      relations: { tags: true },
      where: { id: newsId, status, tags: { status: status } },
    });
    if (!news) return [];

    const parsedNews: NewsDto = this.parseNews(news, language);
    parsedNews.tags = news.tags.map((tag) => tag[`title${capitalize(language)}`]);

    return parsedNews;
  }

  async findByAlias(alias: string, language: LanguageEnum, status: StatusEnum) {
    const news = await this.newsRepository.findOne({
      where: { alias: alias, status },
    });
    if (!news) return [];

    const parsedNews: NewsDto = this.parseNews(news, language);

    return parsedNews;
  }

  async findAllWithContents(status: StatusEnum, { page, limit }: IPagination) {
    const [news, total] = await this.newsRepository.findAndCount({
      relations: { tags: true },
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!news) return [];

    return { data: news, total };
  }

  async findOneWithContents(newsId: number, status: StatusEnum) {
    const news = await this.newsRepository.findOne({
      relations: { tags: true },
      where: { status, id: newsId },
    });
    if (!news) return null;

    return news;
  }

  // CREATE
  async createNews(newsDto: CreateNewsDto) {
    return this.newsRepository.save(this.newsRepository.create({ ...newsDto }));
  }

  // UPDATE
  async updateNews(newsDto: UpdateNewsDto, newsId: number) {
    return this.newsRepository.save({ ...newsDto, id: newsId });
  }

  // DELETE
  async delete(newsId: number) {
    return await this.newsRepository.save({ status: StatusEnum.DELETED, id: newsId });
  }

  // CHECKERS
  async checkById(newsId: number) {
    return this.newsRepository.findOne({ where: { id: newsId } });
  }

  // PARSERS
  parseNews(news: NewsEntity, language: LanguageEnum) {
    const newNews: NewsDto = plainToClass(NewsDto, news, { excludeExtraneousValues: true });

    newNews.title = news[`title${capitalize(language)}`];
    newNews.subtitle = news[`subtitle${capitalize(language)}`];
    newNews.body = news[`body${capitalize(language)}`];

    return newNews;
  }
}
