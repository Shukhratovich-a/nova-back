import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { IPagination } from "@interfaces/pagination.interface";

import { DetailDimensionEntity } from "./detail-dimension.entity";

import { CreateDetailDimensionDto } from "./dtos/create-detail-dimension.dto";
import { UpdateDetailDimensionDto } from "./dtos/update-detail-dimension.dto";

@Injectable()
export class DetailDimensionService {
  constructor(
    @InjectRepository(DetailDimensionEntity, "db_eg")
    private readonly detailDimensionRepository: Repository<DetailDimensionEntity>,
  ) {}

  // FIND
  async findAll() {
    return this.detailDimensionRepository.find();
  }

  async findAllWithCount({ page = 1, limit = 0 }: IPagination) {
    const [dimensions, total] = await this.detailDimensionRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!dimensions) return [];

    return { data: dimensions, total };
  }

  async findOneWithContents(dimensionId: number) {
    const dimension = await this.detailDimensionRepository.findOne({
      where: { id: dimensionId },
    });
    if (!dimension) return null;

    return dimension;
  }

  // CREATE
  async create(dimensionDto: CreateDetailDimensionDto) {
    return await this.detailDimensionRepository.save(this.detailDimensionRepository.create({ ...dimensionDto }));
  }

  // UPDATE
  async update(dimensionDto: UpdateDetailDimensionDto, dimensionId: number) {
    return await this.detailDimensionRepository.save({ ...dimensionDto, id: dimensionId });
  }

  // DELETE
  async delete(dimensionId: number) {
    return await this.detailDimensionRepository.delete(dimensionId);
  }

  // CHECKERS
  async checkById(dimensionId: number) {
    return this.detailDimensionRepository.findOne({ where: { id: dimensionId } });
  }
}
