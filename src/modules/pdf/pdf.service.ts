import { Injectable } from "@nestjs/common";

import { createWriteStream, readFileSync, unlink } from "fs";
import { join } from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as fontkit from "@pdf-lib/fontkit";
import * as sharp from "sharp";

import { CreateProductDto } from "@modules/product/dtos/create-product.dto";

import { interRegularPath, interBoldPath, interSemiBoldPath, logoPath, colorWhite, colorBlue } from "./pdf.constants";

@Injectable()
export class PdfService {
  async createProductPdf(dto: CreateProductDto): Promise<boolean> {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const filePath = join("uploads", "product-files", `${dto.code}.pdf`);

      const interRegularBytes = readFileSync(interRegularPath);
      const interSemiBoldBytes = readFileSync(interSemiBoldPath);
      const interBoldBytes = readFileSync(interBoldPath);

      pdfDoc.registerFontkit(fontkit);
      const interRegularFont = await pdfDoc.embedFont(interRegularBytes);
      const interBoldFont = await pdfDoc.embedFont(interBoldBytes);
      const interSemiBoldFont = await pdfDoc.embedFont(interSemiBoldBytes);

      const logo = readFileSync(logoPath);
      const logoPng = await pdfDoc.embedPng(logo);

      const mainImageBuffer = await fetch(process.env.HOST + dto.mainImage).then((res) => res.arrayBuffer());
      const mainImageResizedBuffer = await sharp(mainImageBuffer)
        .resize(1000, 800, { fit: "contain", background: "white" })
        .png({ quality: 70 })
        .toBuffer();
      const mainImagePng = await pdfDoc.embedPng(mainImageResizedBuffer);

      // LOGO
      page.drawImage(logoPng, {
        y: page.getHeight() - 35 - 10,
        x: page.getWidth() - 125 - 15,
        width: 125,
        height: 35,
      });

      // BACKGROUND
      page.drawRectangle({
        x: 15,
        y: page.getHeight() - 53 - 55,
        width: page.getWidth() - 30,
        height: 53,
        color: colorBlue,
      });

      // CODE
      page.drawText(dto.code, {
        size: 20,
        x: 30,
        y: page.getHeight() - 20 - 60,
        font: interBoldFont,
        color: colorWhite,
      });

      // TITLE;
      page.drawText(dto.titleRu, {
        size: 10,
        x: 30,
        y: page.getHeight() - 12 - 84,
        font: interSemiBoldFont,
        color: colorWhite,
      });

      page.drawImage(mainImagePng, {
        x: 310,
        y: page.getHeight() - 200 - 118,
        width: 250,
        height: 200,
      });

      const pdfBytes = await pdfDoc.save();
      const writeStream = createWriteStream(filePath);
      writeStream.write(pdfBytes);
      writeStream.end();

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }
}
