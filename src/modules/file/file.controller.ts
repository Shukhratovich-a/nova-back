import { Controller, UseInterceptors, Get, Post, UploadedFile, ParseFilePipe, Res } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import * as path from "path";
import * as fs from "fs";

import { FileService } from "./file.service";

import { FileElementResponse } from "./dto/file-element.dto";

import { MFile } from "./mfile.class";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(":filename")
  async downloadFile(@Res() res: Response): Promise<void> {
    const filename = "pdf.pdf"; // Replace with your actual filename
    const filePath = path.join(process.cwd(), "uploads", filename); // Adjust the path accordingly

    res.setHeader("Content-Type", " application/pdf");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [new MFile(file)];

    if (file.mimetype.includes("image")) {
      const buffer = await this.fileService.convertToWebp(file.buffer);

      saveArray.push(
        new MFile({
          originalname: `${file.originalname.split(".")[0]}.webp`,
          buffer,
        }),
      );
    }

    return this.fileService.saveFiles(saveArray);
  }
}
