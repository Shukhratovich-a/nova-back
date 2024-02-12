import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { capitalize } from "@utils/capitalize.utils";

import { TagEntity } from "./tag.entity";

import { TagDto } from "./dto/tag.dto";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

@Injectable()
export class TagService {
  constructor(@InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>) {}

  // FIND
  async findAll(language: LanguageEnum, status: StatusEnum, { page, limit }: IPagination) {
    const tags = await this.tagRepository.find({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!tags) return [];

    const parsedTags: TagDto[] = tags.map((tag) => this.parse(tag, language));

    return parsedTags;
  }

  async findById(tagId: number, language: LanguageEnum, status: StatusEnum) {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId, status },
    });
    if (!tag) return [];

    const parsedTags: TagDto = this.parse(tag, language);

    return parsedTags;
  }

  // CREATE
  async create(tagDto: CreateTagDto) {
    return this.tagRepository.save(this.tagRepository.create({ ...tagDto }));
  }

  // UPDATE
  async update(tagDto: UpdateTagDto, tagId: number) {
    return this.tagRepository.save({ ...tagDto, id: tagId });
  }

  // DELETE
  async delete(tagId: number) {
    return await this.tagRepository.save({ status: StatusEnum.DELETED, id: tagId });
  }

  // CHECKERS
  async checkById(tagId: number) {
    return this.tagRepository.findOne({ where: { id: tagId } });
  }

  // PARSERS
  parse(tag: TagEntity, language: LanguageEnum) {
    const newTag: TagDto = plainToClass(TagDto, tag, { excludeExtraneousValues: true });

    newTag.title = tag[`title${capitalize(language)}`];

    return newTag;
  }
}
