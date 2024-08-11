import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { AboutService } from "./about.service";

import { CreateAboutDto } from "./dtos/create-about.dto";
import { UpdateAboutDto } from "./dtos/update-about.dto";
import { OrderAboutsDto } from "./dtos/order-about.dto";

@Controller("about")
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.aboutService.findAll(language);
  }

  @Get("get-with-count")
  async getAllWithCount(@Query() pagination: IPagination) {
    return this.aboutService.findAllWithCount(pagination);
  }

  @Get("get-one-with-contents/:aboutId")
  async getOneWithContents(@Param("aboutId", new ParseIntPipe()) aboutId: number) {
    return this.aboutService.findOneWithContents(aboutId);
  }

  // POST
  @Post("create")
  async create(@Body() aboutDto: CreateAboutDto) {
    return this.aboutService.create(aboutDto);
  }

  @Post("order")
  async order(@Body() { data }: OrderAboutsDto) {
    return this.aboutService.order(data);
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
