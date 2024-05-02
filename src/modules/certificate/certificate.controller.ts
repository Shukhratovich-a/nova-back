import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { IPagination } from "@interfaces/pagination.interface";
import { LanguageEnum } from "@/enums/language.enum";

import { EnumValidationPipe } from "@/pipes/enum-validation.pipe";

import { CertificateService } from "./certificate.service";

import { CreateCertificateDto } from "./dtos/create-certificate.dto";
import { UpdateCertificateDto } from "./dtos/update-certificate.dto";
import { OrderCertificatesDto } from "./dtos/order-certificate.dto";

@Controller("certificate")
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("language", new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() pagination: IPagination,
  ) {
    return this.certificateService.findAll(pagination, language);
  }

  @Get("get-with-count")
  async getAllWithCount(@Query() pagination: IPagination) {
    return this.certificateService.findAllWithCount(pagination);
  }

  @Get("get-one-with-contents/:certificateId")
  async getOne(@Param("certificateId", new ParseIntPipe()) certificateId: number) {
    return this.certificateService.findOneWithContents(certificateId);
  }

  // POST
  @Post("create")
  async create(@Body() certificateDto: CreateCertificateDto) {
    return this.certificateService.create(certificateDto);
  }

  @Post("order")
  async order(@Body() { data }: OrderCertificatesDto) {
    return this.certificateService.order(data);
  }

  // PUT
  @Put("update/:certificateId")
  async update(@Param("certificateId", new ParseIntPipe()) certificateId: number, @Body() certificateDto: UpdateCertificateDto) {
    const certificate = await this.certificateService.checkCertificateById(certificateId);
    if (!certificate) throw new BadRequestException("not found");

    return this.certificateService.update(certificateDto, certificateId);
  }

  // DELETE
  @Delete("delete/:certificateId")
  async delete(@Param("certificateId", new ParseIntPipe()) certificateId: number) {
    const certificate = await this.certificateService.checkCertificateById(certificateId);
    if (!certificate) throw new BadRequestException("not found");

    return this.certificateService.delete(certificateId);
  }
}
