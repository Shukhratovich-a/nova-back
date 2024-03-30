import { Controller, Get, Res } from "@nestjs/common";
import { ExcelService } from "./excel.service";
import { unlinkSync } from "fs-extra";
import { Response } from "express";

@Controller("excel")
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get("download-products-excel")
  async downloadExcel(@Res() res: Response) {
    const filePath = await this.excelService.generateProductsExcel();

    res.download(filePath, "products.xlsx", (err) => {
      if (err) {
        console.error("Error while downloading file:", err);
      } else {
        unlinkSync(filePath);
      }
    });
  }
}
