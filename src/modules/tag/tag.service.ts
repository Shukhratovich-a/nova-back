import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { In, Repository } from "typeorm";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { capitalize } from "@utils/capitalize.utils";

import { TagEntity } from "./tag.entity";

import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

@Injectable()
export class TagService {
  constructor(@InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>) {}

  // FIND
  async findAllWithContents(status: StatusEnum, { page, limit }: IPagination) {
    const [tags, total] = await this.tagRepository.findAndCount({
      where: { status },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!tags) return [];

    return { data: tags, total };
  }

  async findOneWithContents(tagId: number, status: StatusEnum) {
    const tag = await this.tagRepository.findOne({
      where: { status, id: tagId },
    });
    if (!tag) return null;

    return tag;
  }

  async findByLanguage(tags: string[], language: LanguageEnum, status: StatusEnum) {
    const currentTags = await this.tagRepository.find({
      where: [
        { titleEn: In(tags), status },
        { titleRu: In(tags), status },
        { titleTr: In(tags), status },
        { titleAr: In(tags), status },
      ],
    });
    if (!currentTags) return null;

    const parsedTags = currentTags.map((tag) => this.parse(tag, language));

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
    return tag[`title${capitalize(language)}`];
  }
}
