import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { AboutService } from "./about.service";

import { CreateAboutDto } from "./dtos/create-about.dto";
import { UpdateAboutDto } from "./dtos/update-about.dto";

@Controller("about")
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
  ) {
    return this.aboutService.findAll(language, status);
  }

  @Get("get-with-count")
  async getAllWithCount(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.aboutService.findAllWithCount(status, { page, limit });
  }

  @Get("get-one-with-contents/:aboutId")
  async getOneWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("aboutId", new ParseIntPipe()) aboutId: number,
  ) {
    return this.aboutService.findOneWithContents(aboutId, status);
  }

  // POST
  @Post("create")
  async create(@Body() aboutDto: CreateAboutDto) {
    return this.aboutService.create(aboutDto);
  }

  // PUT
  @Put("update/:aboutId")
  async update(@Param("aboutId", new ParseIntPipe()) aboutId: number, @Body() aboutDto: UpdateAboutDto) {
    const about = await this.aboutService.checkById(aboutId);
    if (!about) throw new BadRequestException("not found");

    return this.aboutService.update(aboutDto, aboutId);
  }

  // DELETE
  @Delete("delete/:aboutId")
  async delete(@Param("aboutId", new ParseIntPipe()) aboutId: number) {
    const about = await this.aboutService.checkById(aboutId);
    if (!about) throw new BadRequestException("not found");

    return this.aboutService.delete(aboutId);
  }
}
