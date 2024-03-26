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

  async convertToWebpAndTrim(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).trim().webp().toBuffer();
  }

  convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).resize({ width: 3000, fit: sharp.fit.contain }).webp().toBuffer();
  }
}
