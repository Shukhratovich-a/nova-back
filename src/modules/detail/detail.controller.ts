import { Body, Controller, Param, ParseIntPipe, Post, ValidationPipe } from "@nestjs/common";

import { DetailService } from "./detail.service";
import { CreateDetailContentDto, CreateDetailDto } from "./dtos/create-detail.dto";

@Controller("detail")
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Post("create-detail")
  async createDetail(@Body(new ValidationPipe()) detailDto: CreateDetailDto) {
    return this.detailService.createDetail(detailDto);
  }

  @Post("create-detail-content/:detailId")
  async createDetailContent(
    @Param("detailId", new ParseIntPipe()) detailId: number,
    @Body(new ValidationPipe()) contentDto: CreateDetailContentDto,
  ) {
    return this.detailService.createDetailContent(contentDto, detailId);
  }
}
