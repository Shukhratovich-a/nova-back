import { Controller, UseInterceptors, Get, Post, UploadedFile, ParseFilePipe, Res, Param, StreamableFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Response } from "express";
import { extname, join } from "path";
import { createReadStream } from "fs";

import { FileService } from "./file.service";

import { FileElementResponse } from "./dto/file-element.dto";

import { MFile } from "./mfile.class";
import { diskStorage } from "multer";
import { format } from "date-fns";
import { path } from "app-root-path";

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
        destination: join(path, "uploads", format(new Date(), "yyyy-MM-dd")),
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
  ) {
    return file.filename;

    // const saveArray: MFile = new MFile(file);
    // return this.fileService.saveFile(saveArray);
  }
}
