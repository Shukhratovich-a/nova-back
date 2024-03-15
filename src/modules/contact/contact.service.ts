import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { StatusEnum } from "@enums/status.enum";

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
