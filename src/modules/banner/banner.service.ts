import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { BannerEntity } from "./banner.entity";

import { BannerDto } from "./dtos/banner.dto";
import { CreateBannerDto } from "./dtos/create-banner.dto";
import { UpdateBannerDto } from "./dtos/update-banner.dto";

@Injectable()
export class BannerService {
  constructor(@InjectRepository(BannerEntity) private readonly bannerRepository: Repository<BannerEntity>) {}

  // FIND
  async findAll(language: LanguageEnum) {
    const [banners, total] = await this.bannerRepository.findAndCount();
    if (!banners) return [];

    const parsedBanner: BannerDto[] = banners.map((banner) => this.parse(banner, language));

    return { data: parsedBanner, total };
  }

  async findAllWithCount({ page, limit }: IPagination) {
    const [banners, total] = await this.bannerRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!banners) return [];

    return {
      data: banners.map((banner) => {
        banner.poster = process.env.HOST + banner.poster;

        return banner;
      }),
      total,
    };
  }

  async findOneWithContents(bannerId: number) {
    const banner = await this.bannerRepository.findOne({
      where: { id: bannerId },
    });
    if (!banner) return null;

    banner.poster = process.env.HOST + banner.poster;

    return banner;
  }

  // CREATE
  async create(bannerDto: CreateBannerDto) {
    return await this.bannerRepository.save(this.bannerRepository.create(bannerDto));
  }

  // UPDATE
  async update(bannerDto: UpdateBannerDto, bannerId: number) {
    return await this.bannerRepository.save({ ...bannerDto, id: bannerId });
  }

  // DELETE
  async delete(bannerId: number) {
    return await this.bannerRepository.delete(bannerId);
  }

  // CHECKERS
  async checkById(bannerId: number) {
    return this.bannerRepository.findOne({ where: { id: bannerId } });
  }

  // PARSERS
  parse(banner: BannerEntity, language: LanguageEnum) {
    const newBanner: BannerDto = plainToClass(BannerDto, banner, { excludeExtraneousValues: true });

    newBanner.title = banner[`title${capitalize(language)}`];
    newBanner.description = banner[`description${capitalize(language)}`];
    newBanner.subtitle = banner[`subtitle${capitalize(language)}`];

    return newBanner;
  }
}
