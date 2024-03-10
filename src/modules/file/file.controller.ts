import { Controller, UseInterceptors, Get, Post, UploadedFile, ParseFilePipe, Res, Param, StreamableFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Response } from "express";
import { extname, join, parse, sep } from "path";
import { path } from "app-root-path";
import { createReadStream } from "fs";
import { diskStorage } from "multer";

import { FileService } from "./file.service";

import { FileElementResponse } from "./dto/file-element.dto";
import { format } from "date-fns";
import { ensureDir } from "fs-extra";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get("get-product-file/:code")
  async getProductFile(@Param("code") code: string, @Res() res: Response): Promise<void> {
    const filename = `${code}.pdf`;
    const filePath = join(process.cwd(), "uploads", "product-files", filename);

    res.setHeader("Content-Type", " application/pdf");

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Get("download-product-file/:code")
  async downloadProductFile(@Param("code") code: string, @Res({ passthrough: true }) res: Response) {
    const filename = `${code}.pdf`;
    const filePath = join(process.cwd(), "uploads", "product-files", filename);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${code}.pdf"`,
    });

    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream);
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const dateFolder = format(new Date(), "yyyy-MM-dd_HH-mm");
          const uploadFolder = join(path, "uploads", "other", dateFolder);
          await ensureDir(uploadFolder);

          console.log(uploadFolder);

          cb(null, uploadFolder);
        },
        filename: (_, file, cb) => {
          const name = file.originalname.split(".")[0];
          const extension = extname(file.originalname);
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          cb(null, `${name}-${randomName}${extension}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File): Promise<FileElementResponse> {
    const parsedPath = parse(file.path);

    const url = parsedPath.dir.replace(path, "").split(sep).join("/") + `/${parsedPath.base}`;

    return { url, name: file.filename };
  }
}
