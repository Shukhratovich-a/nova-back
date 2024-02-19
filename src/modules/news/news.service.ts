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
  async findAll(language: LanguageEnum, status: StatusEnum, { page = 1, limit = 10 }: IPagination) {
    const [news, total] = await this.newsRepository
      .createQueryBuilder("news")
      .leftJoinAndSelect("news.tags", "tags", "tags.status = :status", { status })
      .where("news.status = :status", { status })
      .take(Number(limit))
      .skip((page - 1) * Number(limit) || 0)
      .getManyAndCount();
    if (!news) return [];

    const parsedNews: NewsDto[] = news.map((item) => {
      const newItem = this.parseNews(item, language);

      newItem.tags = item.tags.map((tag) => tag[`title${capitalize(language)}`]);

      return newItem;
    });

    return { data: parsedNews, total };
  }

  async findById(newsId: number, language: LanguageEnum, status: StatusEnum) {
    const news = await this.newsRepository
      .createQueryBuilder("news")
      .leftJoinAndSelect("news.tags", "tags", "tags.status = :status", { status })
      .where("news.id = :id", { id: newsId })
      .andWhere("news.status = :status", { status })
      .getOne();
    if (!news) return null;

    const parsedNews: NewsDto = this.parseNews(news, language);
    parsedNews.tags = news.tags.map((tag) => tag[`title${capitalize(language)}`]);

    return parsedNews;
  }

  async findByAlias(alias: string, language: LanguageEnum, status: StatusEnum) {
    const news = await this.newsRepository
      .createQueryBuilder("news")
      .leftJoinAndSelect("news.tags", "tags", "tags.status = :status", { status })
      .where("news.alias = :alias", { alias })
      .andWhere("news.status = :status", { status })
      .getOne();
    if (!news) return null;

    const parsedNews: NewsDto = this.parseNews(news, language);
    parsedNews.tags = news.tags.map((tag) => tag[`title${capitalize(language)}`]);

    return parsedNews;
  }

  async findAllByTags(
    tags: string[],
    newsId: number,
    language: LanguageEnum,
    status: StatusEnum,
    { page = 1, limit = 10 }: IPagination,
  ) {
    const searchTags = tags.map((tag) => `'${tag}'`).toString();

    const [news, total] = await this.newsRepository
      .createQueryBuilder("news")
      .leftJoinAndSelect("news.tags", "tags", "tags.status = :status", { status })
      .where("news.status = :status", { status })
      .andWhere("news.id != :id", { id: newsId ? newsId : "" })
      .orderBy(`CASE WHEN tags.title${capitalize(language)} IN (${searchTags}) THEN 0 ELSE 1 END`, "ASC")
      .addOrderBy(`tags.title${capitalize(language)}`, "DESC")
      .addOrderBy(`news.createAt`, "ASC")
      .getManyAndCount();
    if (!news) return [];

    const parsedNews: NewsDto[] = news.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit)).map((item) => {
      const newItem = this.parseNews(item, language);
      newItem.tags = item.tags.map((tag) => tag[`title${capitalize(language)}`]);
      return newItem;
    });
    return { data: parsedNews, total };
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
