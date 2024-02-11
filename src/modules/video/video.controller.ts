import { Body, Controller, Param, Query, Get, Post, Put, Delete, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { VideoService } from "./video.service";
import { ProductService } from "@modules/product/product.service";

import { CreateVideoDto } from "./dtos/create-video.dto";
import { UpdateVideoDto } from "./dtos/update-video.dto";

@Controller("video")
export class VideoController {
  constructor(private readonly videoService: VideoService, private readonly productService: ProductService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.videoService.findAll(language, status, { page, limit });
  }

  @Get("get-by-id/:videoId")
  async getById(
    @Param("videoId", new ParseIntPipe()) videoId: number,
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
  ) {
    return this.videoService.findById(videoId, language, status);
  }

  @Get("get-with-count")
  async getAllWithCount(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.videoService.findAllWithCount(status, { page, limit });
  }

  @Get("get-one-with-contents/:videoId")
  async getOne(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Param("videoId", new ParseIntPipe()) videoId: number,
  ) {
    return this.videoService.findOneWithContents(videoId, status);
  }

  @Get("get-by-parent/:videoId")
  async getAllByParentId(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
    @Param("videoId", new ParseIntPipe()) videoId: number,
  ) {
    return this.videoService.findAllByParentId(videoId, status, { page, limit });
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
