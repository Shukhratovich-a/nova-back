import { BadRequestException, Injectable } from "@nestjs/common";

import { extname, join } from "path";
import { ensureDir, writeFile } from "fs-extra";
import { format } from "date-fns";
import { fromBuffer } from "pdf2pic";
import * as sharp from "sharp";

import { FileElementResponse } from "./dto/file-element.dto";

import { MFile } from "./mfile.class";

@Injectable()
export class FileService {
  async saveFile(file: MFile): Promise<FileElementResponse> {
    const dateFolder = format(new Date(), "yyyy-MM-dd_HH-mm");
    const uploadFolder = join(process.cwd(), "uploads", "other", dateFolder);
    await ensureDir(uploadFolder);

    const name = file.originalname.split(".")[0];
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("");

    const filename = `${name}-${randomName}${extension}`;

    await writeFile(join(uploadFolder, filename), file.buffer);
    return { url: `/uploads/other/${dateFolder}/${filename}`, name: file.originalname };
  }

  async convertPdfToPng(buffer: Buffer) {
    const dateFolder = format(new Date(), "yyyy-MM-dd_HH-mm");
    const uploadFolder = join(process.cwd(), "uploads", "other", dateFolder);
    await ensureDir(uploadFolder);

    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("");

    try {
      const options = {
        density: 100,
        saveFilename: randomName,
        savePath: uploadFolder,
        format: "png",
        width: 1000,
        height: 1000,
        preserveAspectRatio: true,
      };
      const convert = fromBuffer(buffer, options);
      const pageToConvertAsImage = 1;

      return convert(pageToConvertAsImage, { responseType: "image" });
    } catch (error) {
      console.log(error);

      throw new BadRequestException();
    }
  }

  async convertToWebpAndTrim(file: Buffer): Promise<Buffer> {
    try {
      return sharp(file)
        .trim()
        .resize({ width: 1800, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .extend({ top: 100, bottom: 100, left: 100, right: 100, background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .toBuffer();
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    try {
      const image = sharp(file);
      const metadata = await image.metadata();
      const originalWidth = metadata.width;

      if (originalWidth > 3000) {
        return image.resize({ width: 3000, fit: sharp.fit.contain }).webp().toBuffer();
      } else {
        return image.webp().toBuffer();
      }
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }
}
