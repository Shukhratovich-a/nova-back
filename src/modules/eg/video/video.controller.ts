import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { VideoService } from "./video.service";
import { ProductService } from "@modules/eg/product/product.service";

import { CreateVideoDto } from "./dtos/create-video.dto";
import { UpdateVideoDto } from "./dtos/update-video.dto";

@Controller("video")
export class VideoController {
  constructor(private readonly videoService: VideoService, private readonly productService: ProductService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    return this.videoService.findAll(language, pagination);
  }

  @Get("get-by-id/:videoId")
  async getById(
    @Param("videoId", new ParseIntPipe()) videoId: number,
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.videoService.findById(videoId, language);
  }

  @Get("get-by-product/:productId")
  async getByProductId(
    @Param("productId", new ParseIntPipe()) productId: number,
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.videoService.findByProductId(productId, language);
  }

  @Get("get-with-count")
  async getAllWithCount(@Query() pagination: IPagination) {
    return this.videoService.findAllWithCount(pagination);
  }

  @Get("get-one-with-contents/:videoId")
  async getOne(@Param("videoId", new ParseIntPipe()) videoId: number) {
    return this.videoService.findOneWithContents(videoId);
  }

  @Get("get-by-parent/:videoId")
  async getAllByParentId(@Query() pagination: IPagination, @Param("videoId", new ParseIntPipe()) videoId: number) {
    return this.videoService.findAllByParentId(videoId, pagination);
  }

  // POST
  @Post("create")
  async create(@Body() videoDto: CreateVideoDto) {
    return this.videoService.create(videoDto);
  }

  // PUT
  @Put("update/:videoId")
  async update(@Param("videoId", new ParseIntPipe()) videoId: number, @Body() videoDto: UpdateVideoDto) {
    const video = await this.videoService.checkById(videoId);
    if (!video) throw new BadRequestException("not found");

    return this.videoService.update(videoDto, videoId);
  }

  // DELETE
  @Delete("delete/:videoId")
  async delete(@Param("videoId", new ParseIntPipe()) videoId: number) {
    const video = await this.videoService.checkById(videoId);
    if (!video) throw new BadRequestException("not found");

    return this.videoService.delete(videoId);
  }
}
