import {
  Controller,
  Param,
  Query,
  Get,
  Post,
  Put,
  Body,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { LanguageEnum } from "@enums/language.enum";

import { BannerService } from "./banner.service";

import { CreateBannerContentDto, CreateBannerDto } from "./dtos/create-banner.dto";
import { UpdateBannerContentDto, UpdateBannerDto } from "./dtos/update-banner.dto";

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

  // POST
  @Post("create-banner")
  async createBanner(@Body(new ValidationPipe()) bannerDto: CreateBannerDto) {
    return this.bannerService.createBanner(bannerDto);
  }

  @Post("create-content/:bannerId")
  async createContent(
    @Param("bannerId", new ParseIntPipe()) bannerId: number,
    @Body(new ValidationPipe()) contentDto: CreateBannerContentDto,
  ) {
    const banner = await this.bannerService.checkBannerById(bannerId);
    if (!banner) throw new BadRequestException("not found");

    const oldContent = await this.bannerService.checkContentForExist(bannerId, contentDto.language);
    if (oldContent) throw new BadRequestException("exists");

    return this.bannerService.createContent(contentDto, bannerId);
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

  @Put("update-content/:contentId")
  async updateContent(
    @Param("contentId", new ParseIntPipe()) contentId: number,
    @Body(new ValidationPipe()) contentDto: UpdateBannerContentDto,
  ) {
    const content = await this.bannerService.checkContentById(contentId);
    if (!content) throw new BadRequestException("not found");

    return this.bannerService.updateContent(contentDto, contentId);
  }
}
