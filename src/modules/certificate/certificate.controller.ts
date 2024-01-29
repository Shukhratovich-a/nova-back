import {
  Controller,
  ValidationPipe,
  ParseIntPipe,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  BadRequestException,
} from "@nestjs/common";

import { EnumValidationPipe } from "@pipes/enum-validation.pipe";

import { IPagination } from "@interfaces/pagination.interface";
import { StatusEnum } from "@enums/status.enum";

import { CertificateService } from "./certificate.service";

import { CreateCertificateDto } from "./dtos/create-certificate.dto";
import { UpdateCertificateDto } from "./dtos/update-certificate.dto";

@Controller("certificate")
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  // GET
  @Get("get-all")
  async getAll(
    @Query("status", new EnumValidationPipe(StatusEnum, { defaultValue: StatusEnum.ACTIVE })) status: StatusEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return this.certificateService.findAll(status, { page, limit });
  }

  // POST
  @Post("create")
  async createCertificate(@Body(new ValidationPipe()) certificateDto: CreateCertificateDto) {
    return this.certificateService.createCertificate(certificateDto);
  }

  // PUT
  @Put("update/:certificateId")
  async updateCertificate(
    @Param("certificateId", new ParseIntPipe()) certificateId: number,
    @Body(new ValidationPipe()) certificateDto: UpdateCertificateDto,
  ) {
    const certificate = await this.certificateService.checkCertificateById(certificateId);
    if (!certificate) throw new BadRequestException("not found");

    return this.certificateService.updateCertificate(certificateDto, certificateId);
  }
}
