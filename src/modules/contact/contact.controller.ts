import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { StatusEnum } from "@enums/status.enum";

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

  // POST
  @Post("create-contact")
  async createContact(@Body() contactDto: CreateContactDto) {
    return this.contactService.createContact(contactDto);
  }

  // PUT
  @Put("update-contact/:contactId")
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
