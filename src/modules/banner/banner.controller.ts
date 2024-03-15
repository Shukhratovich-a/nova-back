import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

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
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
  ) {
    return this.bannerService.findAll(language, status);
  }

  @Get("get-with-count")
  async getAllWithCount(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.bannerService.findAllWithCount(status, { page, limit });
  }

  @Get("get-one-with-contents/:bannerId")
  async getOneWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("bannerId", new ParseIntPipe()) bannerId: number,
  ) {
    return this.bannerService.findOneWithContents(bannerId, status);
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
