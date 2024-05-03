import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { LanguageEnum } from "@/enums/language.enum";
import { ContactTypeEnum } from "@/enums/contact-type.enum";
import { IPagination } from "@/interfaces/pagination.interface";

import { capitalize } from "@/utils/capitalize.utils";

import { ContactEntity } from "./contact.entity";

import { ContactDto } from "./dtos/contact.dto";
import { CreateContactDto } from "./dtos/create-contact.dto";
import { UpdateContactDto } from "./dtos/update-contact.dto";

@Injectable()
export class ContactService {
  constructor(@InjectRepository(ContactEntity) private readonly contactRepository: Repository<ContactEntity>) {}

  // FIND
  async findAll(language: LanguageEnum) {
    const contacts = await this.contactRepository.find();

    const parsedContact = contacts.map((contact) => this.parse(contact, language));

    return parsedContact;
  }

  async findByType(type: ContactTypeEnum, language: LanguageEnum) {
    const contacts = await this.contactRepository.find({ where: { type } });

    const parsedContact = contacts.map((contact) => this.parse(contact, language));

    return parsedContact;
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

  // PARSERS
  parse(contact: ContactEntity, language: LanguageEnum) {
    const newContact: ContactDto = plainToClass(ContactDto, contact, { excludeExtraneousValues: true });

    newContact.company = contact[`company${capitalize(language)}`];
    newContact.address = contact[`address${capitalize(language)}`];
    newContact.country = contact[`country${capitalize(language)}`];

    return newContact;
  }
}
