import {
  Controller,
  Param,
  Query,
  Get,
  Post,
  Put,
  Delete,
  Body,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";

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

  @Get("get-one-with-contents/:categoryId")
  async getOneWithContents(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("categoryId", new ParseIntPipe()) categoryId: number,
  ) {
    return this.bannerService.findOneWithContents(categoryId, status);
  }

  // POST
  @Post("create-banner")
  async createBanner(@Body(new ValidationPipe()) bannerDto: CreateBannerDto) {
    return this.bannerService.createBanner(bannerDto);
  }

  // PUT
  @Put("update-banner/:bannerId")
  async updateBanner(
    @Param("bannerId", new ParseIntPipe()) bannerId: number,
    @Body(new ValidationPipe()) bannerDto: UpdateBannerDto,
  ) {
    const banner = await this.bannerService.checkBannerById(bannerId);
    if (!banner) throw new BadRequestException("not found");

    return this.bannerService.updateBanner(bannerDto, bannerId);
  }

  // DELETE
  @Delete("delete-banner/:bannerId")
  async deleteBanner(@Param("bannerId", new ParseIntPipe()) bannerId: number) {
    const banner = await this.bannerService.checkBannerById(bannerId);
    if (!banner) throw new BadRequestException("not found");

    return this.bannerService.deleteBanner(bannerId);
  }
}
