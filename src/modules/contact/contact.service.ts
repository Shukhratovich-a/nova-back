import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { StatusEnum } from "@enums/status.enum";
import { ContactTypeEnum } from "@/enums/contact-type.enum";
import { IPagination } from "@/interfaces/pagination.interface";

import { ContactEntity } from "./contact.entity";

import { CreateContactDto } from "./dtos/create-contact.dto";
import { UpdateContactDto } from "./dtos/update-contact.dto";

@Injectable()
export class ContactService {
  constructor(@InjectRepository(ContactEntity) private readonly contactRepository: Repository<ContactEntity>) {}

  // FIND
  async findAll(status: StatusEnum) {
    return this.contactRepository.find({
      where: { status },
    });
  }

  async findByType(type: ContactTypeEnum, status: StatusEnum) {
    return this.contactRepository.find({
      where: { status, type },
    });
  }

  async findAllWithCount(status: StatusEnum, { page, limit }: IPagination) {
    const where: Record<string, unknown> = { status };

    const [products, total] = await this.contactRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!products) return [];

    return {
      data: products,
      total,
    };
  }

  async findOneWithContents(contactId: number, status: StatusEnum) {
    const contact = await this.contactRepository.findOne({
      where: { status, id: contactId },
    });
    if (!contact) return null;

    return contact;
  }

  // CREATE
  async createContact(contactDto: CreateContactDto) {
    return await this.contactRepository.save(this.contactRepository.create({ ...contactDto }));
  }

  // UPDATE
  async updateContact(contactDto: UpdateContactDto, contactId: number) {
    return await this.contactRepository.save({ ...contactDto, id: contactId });
  }

  // DELETE
  async delete(contactId: number) {
    return await this.contactRepository.save({ status: StatusEnum.DELETED, id: contactId });
  }

  // CHECKERS
  async checkById(contactId: number) {
    return this.contactRepository.findOne({ where: { id: contactId } });
  }
}
