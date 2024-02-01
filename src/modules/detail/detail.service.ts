import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { LanguageEnum } from "@enums/language.enum";

import { DetailContentEntity, DetailEntity, DetailCategoryEntity, DetailCategoryContentEntity } from "./detail.entity";

import { DetailCategoryDto, DetailDto } from "./dtos/detail.dto";

@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(DetailEntity) private readonly detailRepository: Repository<DetailEntity>,
    @InjectRepository(DetailContentEntity) private readonly detailContentRepository: Repository<DetailContentEntity>,
    @InjectRepository(DetailCategoryEntity) private readonly detailCategoryRepository: Repository<DetailCategoryEntity>,
    @InjectRepository(DetailCategoryContentEntity)
    private readonly detailCategoryContentRepository: Repository<DetailCategoryContentEntity>,
  ) {}

  async findAllCategories(language: LanguageEnum) {
    return this.detailCategoryRepository.find({ relations: { contents: true }, where: { contents: { language } } });
  }

  async findDetailsById(productId: number, language: LanguageEnum) {
    return this.detailRepository.find({
      relations: { contents: true, category: { contents: true } },
      where: { product: { id: productId }, contents: { language } },
    });
  }

  async sortDetails(details: DetailEntity[], language: LanguageEnum) {
    if (!details || !details.length) return [];

    const newDetails: DetailCategoryDto[] = [];
    const detailCategories = await this.findAllCategories(language);

    detailCategories.forEach((category) => {
      const filteredDetails = details.filter((detail) => detail.category.id === category.id);

      if (filteredDetails.length) {
        const newCategory: DetailCategoryDto = {
          id: category.id,
          title: category.contents[0].title,
          details: filteredDetails.map((detail) => this.parseDetail(detail)),
        };

        newDetails.push(newCategory);
      }
    });

    return newDetails;
  }

  parseDetail(detail: DetailEntity) {
    const newDetail: DetailDto = plainToClass(DetailDto, detail, { excludeExtraneousValues: true });

    if (detail.contents && detail.contents.length) {
      newDetail.name = detail.contents[0].name;
      newDetail.value = detail.contents[0].value;
    }

    return newDetail;
  }

  parseDetailCategory(category: DetailCategoryEntity) {
    const newCategory: DetailCategoryDto = plainToClass(DetailCategoryDto, category, {
      excludeExtraneousValues: true,
    });

    if (category.contents && category.contents.length) {
      newCategory.title = category.contents[0].title;
    }

    return newCategory;
  }
}
