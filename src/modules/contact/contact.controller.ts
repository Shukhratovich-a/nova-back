import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { StatusEnum } from "@enums/status.enum";
import { ContactTypeEnum } from "@enums/contact-type.enum";
import { IPagination } from "@/interfaces/pagination.interface";

import { ContactService } from "./contact.service";

import { CreateContactDto } from "./dtos/create-contact.dto";
import { UpdateContactDto } from "./dtos/update-contact.dto";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get("get-all")
  async getAll(@Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum) {
    return this.contactService.findAll(status);
  }

  @Get("get-by-type/:type")
  async getByType(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("type", new EnumValidationPipe(ContactTypeEnum, { defaultValue: ContactTypeEnum.CENTRAL })) type: ContactTypeEnum,
  ) {
    return this.contactService.findByType(type, status);
  }

  @Get("get-with-count")
  async getAllWithCount(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.contactService.findAllWithCount(status, { page, limit });
  }

  @Get("get-one-with-contents/:contactId")
  async getOneWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("contactId", new ParseIntPipe()) contactId: number,
  ) {
    return this.contactService.findOneWithContents(contactId, status);
  }

  // POST
  @Post("create")
  async createContact(@Body() contactDto: CreateContactDto) {
    return this.contactService.createContact(contactDto);
  }

  // PUT
  @Put("update/:contactId")
  async updateContact(@Param("contactId", new ParseIntPipe()) contactId: number, @Body() contactDto: UpdateContactDto) {
    const contact = await this.contactService.checkById(contactId);
    if (!contact) throw new BadRequestException("not found");

    return this.contactService.updateContact(contactDto, contactId);
  }

  // DELETE
  @Delete("delete/:contactId")
  async delete(@Param("contactId", new ParseIntPipe()) contactId: number) {
    const contact = await this.contactService.checkById(contactId);
    if (!contact) throw new BadRequestException("not found");

    return this.contactService.delete(contactId);
  }
}
