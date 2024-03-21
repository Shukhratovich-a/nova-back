import { Injectable } from "@nestjs/common";

import { extname, join } from "path";
import { ensureDir, writeFile } from "fs-extra";
import { format } from "date-fns";
import { path } from "app-root-path";
import { fromPath } from "pdf2pic";
import * as sharp from "sharp";

import { FileElementResponse } from "./dto/file-element.dto";

import { MFile } from "./mfile.class";

@Injectable()
export class FileService {
  async saveFile(file: MFile): Promise<FileElementResponse> {
    const dateFolder = format(new Date(), "yyyy-MM-dd");
    const uploadFolder = join(path, "uploads", dateFolder);
    await ensureDir(uploadFolder);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `${file.originalname}-${uniqueSuffix}${ext}`;

    await writeFile(join(uploadFolder, filename), file.buffer);
    return { url: `/uploads/${dateFolder}/${filename}`, name: file.originalname };
  }

  async convertPdfToPng(filePath: string) {
    try {
      const inputFile = join(path, filePath);
      const outputFile = join(path, "uploads");

      const options = {
        saveFilename: "image",
        savePath: outputFile,
        format: "png",
        width: 600,
        height: 800,
      };

      const convert = fromPath(inputFile, options);

      const pageOutput = await convert(1, { responseType: "image" });
    } catch (error) {
      console.log(error);
    }
  }

  async detachImage(filePath: string) {
    const inputFile = join(path, filePath);
    const outputFile = join(path, "uploads", "image.png");

    // sharp(inputFile)
    //   .trim()
    //   .toFile(outputFile, (err, info) => {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       console.log("Image processed successfully:", info);
    //     }
    //   });

    // return true;
  }

  convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
