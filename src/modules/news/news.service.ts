import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { NewsEntity } from "./news.entity";

import { NewsDto } from "./dto/news.dto";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";

@Injectable()
export class NewsService {
  constructor(@InjectRepository(NewsEntity) private readonly newsRepository: Repository<NewsEntity>) {}

  // FIND
  async findAll(language: LanguageEnum, { page = 1, limit = 0 }: IPagination) {
    const [news, total] = await this.newsRepository
      .createQueryBuilder("news")
      .leftJoinAndSelect("news.tags", "tags")
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    if (!news) return [];

    const parsedNews: NewsDto[] = news.map((item) => {
      const newItem = this.parseNews(item, language);

      newItem.tags = item.tags.map((tag) => tag[`title${capitalize(language)}`]);

      return newItem;
    });

    return { data: parsedNews, total };
  }

  async findById(newsId: number, language: LanguageEnum) {
    const news = await this.newsRepository
      .createQueryBuilder("news")
      .leftJoinAndSelect("news.tags", "tags")
      .where("news.id = :id", { id: newsId })
      .getOne();
    if (!news) return null;

    const parsedNews: NewsDto = this.parseNews(news, language);
    parsedNews.tags = news.tags.map((tag) => tag[`title${capitalize(language)}`]);

    return parsedNews;
  }

  async findByAlias(alias: string, language: LanguageEnum) {
    const news = await this.newsRepository
      .createQueryBuilder("news")
      .leftJoinAndSelect("news.tags", "tags")
      .where("news.alias = :alias", { alias })
      .getOne();
    if (!news) return null;

    const parsedNews: NewsDto = this.parseNews(news, language);
    parsedNews.tags = news.tags.map((tag) => tag[`title${capitalize(language)}`]);

    return parsedNews;
  }

  async findAllByTags(tags: string[], newsId: number, language: LanguageEnum, { page = 1, limit = 0 }: IPagination) {
    const searchTags = tags.map((tag) => `'${tag}'`).toString();

    const [news, total] = await this.newsRepository
      .createQueryBuilder("news")
      .leftJoinAndSelect("news.tags", "tags")
      .andWhere("news.id != :id", { id: newsId ? newsId : "" })
      .orderBy(`CASE WHEN tags.title${capitalize(language)} IN (${searchTags}) THEN 0 ELSE 1 END`, "ASC")
      .addOrderBy(`tags.title${capitalize(language)}`, "DESC")
      .addOrderBy(`news.createAt`, "ASC")
      .getManyAndCount();
    if (!news) return [];

    const parsedNews: NewsDto[] = news.slice((page - 1) * limit, page * limit).map((item) => {
      const newItem = this.parseNews(item, language);
      newItem.tags = item.tags.map((tag) => tag[`title${capitalize(language)}`]);
      return newItem;
    });
    return { data: parsedNews, total };
  }

  async findAllWithContents({ page = 1, limit = 0 }: IPagination) {
    const [news, total] = await this.newsRepository.findAndCount({
      relations: { tags: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!news) return [];

    return {
      data: news.map((item) => {
        item.poster = process.env.HOST + item.poster;
        if (item.image) item.image = process.env.HOST + item.image;

        return item;
      }),
      total,
    };
  }

  async findOneWithContents(newsId: number) {
    const news = await this.newsRepository.findOne({
      relations: { tags: true },
      where: { id: newsId },
    });
    if (!news) return null;

    news.poster = process.env.HOST + news.poster;
    if (news.image) news.image = process.env.HOST + news.image;

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
    return await this.newsRepository.delete(newsId);
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
