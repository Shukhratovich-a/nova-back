import { Injectable, BadRequestException } from "@nestjs/common";
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
import { OrderBannerDto } from "./dtos/order-banner.dto";

@Injectable()
export class BannerService {
  constructor(@InjectRepository(BannerEntity, "db_eg") private readonly bannerRepository: Repository<BannerEntity>) {}

  // FIND
  async findAll(language: LanguageEnum) {
    const [banners, total] = await this.bannerRepository.findAndCount();
    if (!banners) return [];

    const parsedBanner: BannerDto[] = banners.map((banner) => this.parse(banner, language));

    return { data: parsedBanner, total };
  }

  async findAllWithCount({ page = 1, limit = 10 }: IPagination) {
    const [banners, total] = await this.bannerRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!banners) return [];

    return {
      data: banners.map((banner) => {
        banner.posterDesktop = process.env.HOST + banner.posterDesktop;
        banner.posterMobile = process.env.HOST + banner.posterMobile;

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

    banner.posterDesktop = process.env.HOST + banner.posterDesktop;
    banner.posterMobile = process.env.HOST + banner.posterMobile;

    return banner;
  }

  // ORDER
  async order(banners: OrderBannerDto[]) {
    try {
      for (const { id, order } of banners) {
        const currentTag = await this.bannerRepository.find({ where: { id } });
        if (!currentTag) continue;

        await this.bannerRepository.save({ order, id });
      }

      return { success: true };
    } catch {
      throw new BadRequestException();
    }
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
