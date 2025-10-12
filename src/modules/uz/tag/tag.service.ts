import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { In, Repository } from "typeorm";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { TagEntity } from "./tag.entity";

import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { OrderTagDto } from "./dto/order-tag.dto";

@Injectable()
export class TagService {
  constructor(@InjectRepository(TagEntity, "db_uz") private readonly tagRepository: Repository<TagEntity>) {}

  // FIND
  async findAllWithContents({ page = 1, limit = 10 }: IPagination) {
    const [tags, total] = await this.tagRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!tags) return [];

    return { data: tags, total };
  }

  async findOneWithContents(tagId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });
    if (!tag) return null;

    return tag;
  }

  async findByLanguage(tags: string[], language: LanguageEnum) {
    const currentTags = await this.tagRepository.find({
      where: [{ titleEn: In(tags) }, { titleRu: In(tags) }, { titleTr: In(tags) }, { titleAr: In(tags) }],
    });
    if (!currentTags) return null;

    const parsedTags = currentTags.map((tag) => this.parse(tag, language));

    return parsedTags;
  }

  // ORDER
  async order(tags: OrderTagDto[]) {
    try {
      for (const { id, order } of tags) {
        const currentTag = await this.tagRepository.find({ where: { id } });
        if (!currentTag) continue;

        await this.tagRepository.save({ order, id });
      }

      return { success: true };
    } catch {
      throw new BadRequestException();
    }
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
    return await this.tagRepository.delete(tagId);
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
