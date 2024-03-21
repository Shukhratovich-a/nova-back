import { Injectable } from "@nestjs/common";

import { extname, join } from "path";
import { ensureDir, writeFile } from "fs-extra";
import { format } from "date-fns";
import { path } from "app-root-path";
import { fromPath } from "pdf2pic";
import * as sharp from "sharp";

import { FileElementResponse } from "./dto/file-element.dto";

import { MFile } from "./mfile.class";
import { exec } from "child_process";

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
    const inputFile = join(path, filePath);
    const outputFile = join(path, "uploads", "image.png");

    try {
      const command = `convert ${inputFile}[0] ${outputFile}`;

      // Execute the command
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`PDF converted to PNG: ${outputFile}`);
      });
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
