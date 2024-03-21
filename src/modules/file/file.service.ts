import { Injectable } from "@nestjs/common";

import { extname, join } from "path";
import { ensureDir, writeFile } from "fs-extra";
import { format } from "date-fns";
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

  convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
