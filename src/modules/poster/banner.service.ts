import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { LanguageEnum } from "@/enums/language.enum";

import { BannerEntity, BannerContentEntity } from "./banner.entity";

import { CreateBannerContentDto, CreateBannerDto } from "./dtos/create-banner.dto";
import { BannerDto } from "./dtos/banner.dto";
import { plainToClass } from "class-transformer";
import { UpdateBannerContentDto, UpdateBannerDto } from "./dtos/update-banner.dto";

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
    @InjectRepository(BannerContentEntity)
    private readonly contentRepository: Repository<BannerContentEntity>,
  ) {}

  // FIND
  async findAll(language: LanguageEnum) {
    const banners = await this.bannerRepository.find({
      relations: { contents: true },
      where: { contents: { language } },
    });
    if (!banners) return [];

    const parsedBanner: BannerDto[] = banners.map((banner) => {
      return this.parseBanner(banner);
    });

    return parsedBanner;
  }

  // CREATE
  async createBanner(bannerDto: CreateBannerDto) {
    return await this.bannerRepository.save(this.bannerRepository.create(bannerDto));
  }

  async createContent(contentDto: CreateBannerContentDto, bannerId: number) {
    return await this.contentRepository.save(
      this.contentRepository.create({ ...contentDto, banner: { id: bannerId } }),
    );
  }

  // UPDATE
  async updateBanner(bannerDto: UpdateBannerDto, bannerId: number) {
    return await this.bannerRepository.save({ ...bannerDto, id: bannerId });
  }

  async updateContent(contentDto: UpdateBannerContentDto, contentId: number) {
    return await this.contentRepository.save({ ...contentDto, id: contentId });
  }

  // CHECKERS
  async checkBannerById(bannerId: number) {
    return this.bannerRepository.findOne({ where: { id: bannerId } });
  }

  async checkContentById(bannerId: number) {
    return this.contentRepository.findOne({ where: { id: bannerId }, relations: { banner: true } });
  }

  async checkContentForExist(bannerId: number, language: LanguageEnum) {
    return this.contentRepository.findOne({ where: { banner: { id: bannerId }, language } });
  }

  // PARSERS
  parseBanner(banner: BannerEntity) {
    const newBanner: BannerDto = plainToClass(BannerDto, banner, { excludeExtraneousValues: true });

    if (banner.contents && banner.contents.length) {
      newBanner.title = banner.contents[0].title;
      newBanner.description = banner.contents[0].description;
      newBanner.subtitle = banner.contents[0].subtitle;
    }

    return newBanner;
  }
}
