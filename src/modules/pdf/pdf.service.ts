import { Injectable } from "@nestjs/common";

import { join } from "path";
import puppeteer from "puppeteer";

import { ProductDto } from "@modules/product/dtos/product.dto";

import { pdf } from "./pdf.constants";

@Injectable()
export class PdfService {
  async createProductPdf(dto: ProductDto): Promise<boolean> {
    const filePath = join("uploads", "product-files", `${dto.code}.pdf`);

    const browser = await puppeteer.launch({ product: "chrome" });
    const page = await browser.newPage();

    await page.setContent(await pdf(dto));
    await page.setViewport({ width: 595, height: 842, deviceScaleFactor: 1, isLandscape: true });
    await page.pdf({ path: filePath, format: "A4", printBackground: true, margin: { top: 0 }, scale: 1.3 });

    await browser.close();

    return true;
  }
}
