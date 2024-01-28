import {
  Controller,
  ValidationPipe,
  ParseIntPipe,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  BadRequestException,
} from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { StatusEnum } from "@enums/status.enum";

import { ContactService } from "./contact.service";

import { CreateContactDto, CreateCoordDto } from "./dtos/create-contact.dto";
import { UpdateContactDto, UpdateCoordDto } from "./dtos/update-contact.dto";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get("get-all")
  async getAll(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
  ) {
    return this.contactService.findAll(status);
  }

  // POST
  @Post("create-contact")
  async createContact(@Body(new ValidationPipe()) categoryDto: CreateContactDto) {
    return this.contactService.createContact(categoryDto);
  }

  @Post("create-coord/:contactId")
  async createContent(
    @Param("contactId", new ParseIntPipe()) contactId: number,
    @Body(new ValidationPipe()) coordDto: CreateCoordDto,
  ) {
    const contact = await this.contactService.checkContactById(contactId);
    if (!contact) throw new BadRequestException("not found");

    const oldCoord = await this.contactService.checkCoordForExist(contactId);
    if (oldCoord) throw new BadRequestException("exists");

    return this.contactService.createCoord(coordDto, contactId);
  }

  // PUT
  @Put("update-contact/:contactId")
  async updateContact(
    @Param("contactId", new ParseIntPipe()) contactId: number,
    @Body(new ValidationPipe()) contactDto: UpdateContactDto,
  ) {
    const contact = await this.contactService.checkContactById(contactId);
    if (!contact) throw new BadRequestException("not found");

    return this.contactService.updateContact(contactDto, contactId);
  }

  @Put("update-coord/:coordId")
  async updateCoord(
    @Param("coordId", new ParseIntPipe()) coordId: number,
    @Body(new ValidationPipe()) coordDto: UpdateCoordDto,
  ) {
    const coord = await this.contactService.checkCoordById(coordId);
    if (!coord) throw new BadRequestException("not found");

    return this.contactService.updateCoord(coordDto, coordId);
  }
}
