import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@enums/language.enum";

import { capitalize } from "@utils/capitalize.utils";

import { VideoEntity } from "./video.entity";

import { ProductService } from "@modules/product/product.service";

import { VideoDto } from "./dtos/video.dto";
import { CreateVideoDto } from "./dtos/create-video.dto";
import { UpdateVideoDto } from "./dtos/update-video.dto";

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity) private readonly videoRepository: Repository<VideoEntity>,
    private readonly productService: ProductService,
  ) {}

  // FIND
  async findAll(language: LanguageEnum, { page = 1, limit = 0 }: IPagination) {
    const videos = await this.videoRepository.find({
      relations: { products: true },
      take: limit,
      skip: (page - 1) * limit,
      order: { products: { code: "ASC" } },
    });
    if (!videos) return [];

    const parsedVideos: VideoDto[] = videos.map((video) => {
      const parsedVideo = this.parse(video, language);

      parsedVideo.products = video.products.map((product) => this.productService.parse(product, language));

      return parsedVideo;
    });

    return parsedVideos;
  }

  async findById(videoId: number, language: LanguageEnum) {
    const video = await this.videoRepository.findOne({
      relations: { products: true },
      where: { id: videoId },
      order: { products: { code: "ASC" } },
    });
    if (!video) return null;

    const parsedVideo: VideoDto = this.parse(video, language);
    parsedVideo.products = video.products.map((product) => this.productService.parse(product, language));

    return parsedVideo;
  }

  async findAllWithCount({ page = 1, limit = 0 }: IPagination) {
    const [videos, total] = await this.videoRepository.findAndCount({
      relations: { products: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!videos) return [];

    return { data: videos, total };
  }

  async findOneWithContents(videoId: number) {
    const video = await this.videoRepository.findOne({
      relations: { products: true },
      where: { id: videoId },
      order: { products: { code: "ASC" } },
    });
    if (!video) return null;

    return video;
  }

  async findAllByParentId(videoId: number, { page = 1, limit = 0 }: IPagination) {
    const [videos, total] = await this.videoRepository.findAndCount({
      relations: { products: true },
      where: { products: { id: videoId } },
      take: limit,
      skip: (page - 1) * limit,
      order: { products: { code: "ASC" } },
    });
    if (!videos) return [];

    return { data: videos, total };
  }

  // CREATE
  async create(videoDto: CreateVideoDto) {
    return await this.videoRepository.save(this.videoRepository.create({ ...videoDto, products: videoDto.products }));
  }

  // UPDATE
  async update(videoDto: UpdateVideoDto, videoId: number) {
    return await this.videoRepository.save({ ...videoDto, id: videoId });
  }

  // DELETE
  async delete(videoId: number) {
    return await this.videoRepository.delete(videoId);
  }

  // PARSERS
  parse(product: VideoEntity, language: LanguageEnum) {
    const newVideo: VideoDto = plainToClass(VideoDto, product, { excludeExtraneousValues: true });

    newVideo.title = product[`title${capitalize(language)}`];

    return newVideo;
  }

  // CHECKERS
  async checkById(videoId: number) {
    return this.videoRepository.findOne({ where: { id: videoId } });
  }
}
