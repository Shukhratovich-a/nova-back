import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { StatusEnum } from "@enums/status.enum";

import { ContactEntity, CoordEntity } from "./contact.entity";

import { CreateContactDto, CreateCoordDto } from "./dtos/create-contact.dto";
import { UpdateContactDto, UpdateCoordDto } from "./dtos/update-contact.dto";

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity) private readonly contactRepository: Repository<ContactEntity>,
    @InjectRepository(CoordEntity) private readonly coordRepository: Repository<CoordEntity>,
  ) {}

  async findAll(status: StatusEnum) {
    return this.contactRepository.find({
      select: { coord: { longitude: true, latitude: true } },
      relations: { coord: true },
      where: { status },
    });
  }

  // CREATE
  async createContact(contactDto: CreateContactDto) {
    return await this.contactRepository.save(this.contactRepository.create({ ...contactDto }));
  }

  async createCoord(coordDto: CreateCoordDto, contactId: number) {
    return await this.coordRepository.save(this.coordRepository.create({ ...coordDto, contact: { id: contactId } }));
  }

  // UPDATE
  async updateContact(contactDto: UpdateContactDto, contactId: number) {
    return await this.contactRepository.save({ ...contactDto, id: contactId });
  }

  async updateCoord(coordDto: UpdateCoordDto, coordId: number) {
    return await this.coordRepository.save({ ...coordDto, id: coordId });
  }

  // CHECKERS
  async checkContactById(contactId: number) {
    return this.contactRepository.findOne({ where: { id: contactId } });
  }

  async checkCoordById(coordId: number) {
    return this.coordRepository.findOne({ where: { id: coordId }, relations: { contact: true } });
  }

  async checkCoordForExist(categoryId: number) {
    return this.coordRepository.findOne({ where: { contact: { id: categoryId } } });
  }
}
