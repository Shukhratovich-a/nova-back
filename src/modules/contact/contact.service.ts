import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { ContactTypeEnum } from "@/enums/contact-type.enum";
import { IPagination } from "@/interfaces/pagination.interface";

import { ContactEntity } from "./contact.entity";

import { CreateContactDto } from "./dtos/create-contact.dto";
import { UpdateContactDto } from "./dtos/update-contact.dto";

@Injectable()
export class ContactService {
  constructor(@InjectRepository(ContactEntity) private readonly contactRepository: Repository<ContactEntity>) {}

  // FIND
  async findAll() {
    return this.contactRepository.find();
  }

  async findByType(type: ContactTypeEnum) {
    return this.contactRepository.find({
      where: { type },
    });
  }

  async findAllWithCount({ page = 1, limit = 0 }: IPagination) {
    const [products, total] = await this.contactRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!products) return [];

    return {
      data: products,
      total,
    };
  }

  async findOneWithContents(contactId: number) {
    const contact = await this.contactRepository.findOne({
      where: { id: contactId },
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
    return await this.contactRepository.delete(contactId);
  }

  // CHECKERS
  async checkById(contactId: number) {
    return this.contactRepository.findOne({ where: { id: contactId } });
  }
}
