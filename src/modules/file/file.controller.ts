import { Controller, UseInterceptors, Get, Post, UploadedFile, ParseFilePipe, Res, Param, StreamableFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Response } from "express";
import { join, parse, sep } from "path";
import { path } from "app-root-path";
import { createReadStream } from "fs";

import { FileService } from "./file.service";

import { FileElementResponse } from "./dto/file-element.dto";

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
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File): Promise<FileElementResponse> {
    const parsedPath = parse(file.path);

    const url = parsedPath.dir.replace(path, "").split(sep).join("/") + `/${parsedPath.base}`;

    return { url, name: file.filename };
  }
}
