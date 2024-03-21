import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { BannerService } from "./banner.service";

import { CreateBannerDto } from "./dtos/create-banner.dto";
import { UpdateBannerDto } from "./dtos/update-banner.dto";

@Controller("banner")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.bannerService.findAll(language);
  }

  @Get("get-with-count")
  async getAllWithCount(@Query() { page, limit }: IPagination) {
    return this.bannerService.findAllWithCount({ page, limit });
  }

  @Get("get-one-with-contents/:bannerId")
  async getOneWithContents(@Param("bannerId", new ParseIntPipe()) bannerId: number) {
    return this.bannerService.findOneWithContents(bannerId);
  }

  // POST
  @Post("create")
  async create(@Body() bannerDto: CreateBannerDto) {
    return this.bannerService.create(bannerDto);
  }

  // PUT
  @Put("update/:bannerId")
  async update(@Param("bannerId", new ParseIntPipe()) bannerId: number, @Body() bannerDto: UpdateBannerDto) {
    const banner = await this.bannerService.checkById(bannerId);
    if (!banner) throw new BadRequestException("not found");

    return this.bannerService.update(bannerDto, bannerId);
  }

  // DELETE
  @Delete("delete/:bannerId")
  async delete(@Param("bannerId", new ParseIntPipe()) bannerId: number) {
    const banner = await this.bannerService.checkById(bannerId);
    if (!banner) throw new BadRequestException("not found");

    return this.bannerService.delete(bannerId);
  }
}
