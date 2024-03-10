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

const storage = diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const name = file.originalname.split(".")[0];
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("");
    cb(null, `${name}-${randomName}${extension}`);
  },
});

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
  @UseInterceptors(FileInterceptor("file", { storage }))
  async uploadFile(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File) {
    console.log(file);
    return { message: "File uploaded successfully!", filename: file.filename };

    // const saveArray: MFile = new MFile(file);
    // return this.fileService.saveFile(saveArray);
  }
}
