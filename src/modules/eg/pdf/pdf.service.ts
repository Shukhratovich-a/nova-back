import { Injectable } from "@nestjs/common";

import { join } from "path";
import puppeteer from "puppeteer";

import { LanguageEnum } from "@enums/language.enum";

import { ProductDto } from "@modules/eg/product/dtos/product.dto";

import { pdf } from "./pdf.constants";

@Injectable()
export class PdfService {
  async createProductPdf(dto: ProductDto, language: LanguageEnum): Promise<boolean> {
    const filePath = join("uploads", "product-files", `${dto.code + (language ? "-" + language : "")}.pdf`);

    try {
      const browser = await puppeteer.launch({ product: "chrome" });
      const page = await browser.newPage();

      await page.setContent(await pdf(dto, language));
      await page.setViewport({ width: 595, height: 842, deviceScaleFactor: 1, isLandscape: true });
      await page.setCacheEnabled(false);
      await page.pdf({ path: filePath, format: "A4", printBackground: true, margin: { top: 0 }, scale: 1.3 });

      await browser.close();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
