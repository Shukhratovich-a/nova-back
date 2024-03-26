import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException } from "@nestjs/common";

import { IPagination } from "@interfaces/pagination.interface";

import { CertificateService } from "./certificate.service";

import { CreateCertificateDto } from "./dtos/create-certificate.dto";
import { UpdateCertificateDto } from "./dtos/update-certificate.dto";

@Controller("certificate")
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  // GET
  @Get("get-all")
  async getAll(@Query() pagination: IPagination) {
    return this.certificateService.findAll(pagination);
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
