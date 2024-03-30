import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { IPagination } from "@interfaces/pagination.interface";

import { DetailTypeEntity } from "./detail-type.entity";

import { CreateDetailTypeDto } from "./dtos/create-detail-type.dto";
import { UpdateDetailTypeDto } from "./dtos/update-detail-type.dto";

@Injectable()
export class DetailTypeService {
  constructor(@InjectRepository(DetailTypeEntity) private readonly detailTypeRepository: Repository<DetailTypeEntity>) {}

  // FIND
  async findAll() {
    return this.detailTypeRepository.find();
  }

  async findAllWithCount({ page = 1, limit = 0 }: IPagination) {
    const [types, total] = await this.detailTypeRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!types) return [];

    return { data: types, total };
  }

  async findOneWithContents(typeId: number) {
    const type = await this.detailTypeRepository.findOne({
      where: { id: typeId },
    });
    if (!type) return null;

    return type;
  }

  // CREATE
  async create(typeDto: CreateDetailTypeDto) {
    return await this.detailTypeRepository.save(this.detailTypeRepository.create({ ...typeDto }));
  }

  // UPDATE
  async update(typeDto: UpdateDetailTypeDto, typeId: number) {
    return await this.detailTypeRepository.save({ ...typeDto, id: typeId });
  }

  // DELETE
  async delete(typeId: number) {
    return await this.detailTypeRepository.delete(typeId);
  }

  // CHECKERS
  async checkById(typeId: number) {
    return this.detailTypeRepository.findOne({ where: { id: typeId } });
  }
}
