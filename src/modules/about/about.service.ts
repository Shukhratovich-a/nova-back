import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { AboutEntity } from "./about.entity";

import { AboutDto } from "./dtos/about.dto";
import { CreateAboutDto } from "./dtos/create-about.dto";
import { UpdateAboutDto } from "./dtos/update-about.dto";

@Injectable()
export class AboutService {
  constructor(@InjectRepository(AboutEntity) private readonly aboutRepository: Repository<AboutEntity>) {}

  // FIND
  async findAll(language: LanguageEnum) {
    const [abouts, total] = await this.aboutRepository.findAndCount();
    if (!abouts) return [];

    const parsedAbouts: AboutDto[] = abouts.map((about) => this.parse(about, language));

    return { data: parsedAbouts, total };
  }

  async findAllWithCount({ page = 1, limit = 0 }: IPagination) {
    const [abouts, total] = await this.aboutRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!abouts) return [];

    return {
      data: abouts.map((about) => {
        about.poster = process.env.HOST + about.poster;

        return about;
      }),
      total,
    };
  }

  async findOneWithContents(aboutId: number) {
    const about = await this.aboutRepository.findOne({
      where: { id: aboutId },
    });
    if (!about) return null;

    about.poster = process.env.HOST + about.poster;

    return about;
  }

  // CREATE
  async create(aboutDto: CreateAboutDto) {
    return await this.aboutRepository.save(this.aboutRepository.create(aboutDto));
  }

  // UPDATE
  async update(aboutDto: UpdateAboutDto, aboutId: number) {
    return await this.aboutRepository.save({ ...aboutDto, id: aboutId });
  }

  // DELETE
  async delete(aboutId: number) {
    return await this.aboutRepository.delete(aboutId);
  }

  // CHECKERS
  async checkById(aboutId: number) {
    return this.aboutRepository.findOne({ where: { id: aboutId } });
  }

  // PARSERS
  parse(about: AboutEntity, language: LanguageEnum) {
    const newAbout: AboutDto = plainToClass(AboutDto, about, { excludeExtraneousValues: true });

    newAbout.title = about[`title${capitalize(language)}`];
    newAbout.description = about[`description${capitalize(language)}`];

    return newAbout;
  }
}
