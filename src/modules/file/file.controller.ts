import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  UploadedFile,
  HttpCode,
  Res,
  Param,
  StreamableFile,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Response } from "express";
import { join, parse } from "path";
import { createReadStream, existsSync } from "fs";

import { FileService } from "./file.service";

import { MFile } from "./mfile.class";
import { FileElementResponse } from "./dto/file-element.dto";
import { readFile } from "fs-extra";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get("get-file")
  async getFile(@Query("file") file: string, @Res() res: Response): Promise<void> {
    try {
      const parsedFile = parse(file);

      const filename = parsedFile.base;
      const filePath = join(process.cwd(), parsedFile.dir, filename);

      const isExists = existsSync(filePath);
      if (!isExists) throw new BadRequestException();

      if (parsedFile.ext === ".pdf") res.setHeader("Content-Type", " application/pdf");

      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    } catch {
      throw new BadRequestException();
    }
  }

  @Get("download-file")
  async downloadFile(@Query("file") file: string, @Res() res: Response): Promise<void> {
    try {
      const parsedFile = parse(file);

      const filename = parsedFile.base;
      const filePath = join(process.cwd(), parsedFile.dir, filename);

      const isExists = existsSync(filePath);
      if (!isExists) throw new BadRequestException();

      if (parsedFile.ext === ".pdf") res.setHeader("Content-Type", " application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    } catch {
      throw new BadRequestException();
    }
  }

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
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse> {
    if (file.mimetype.includes("image")) {
      const buffer = await this.fileService.convertToWebp(file.buffer);

      const save: MFile = new MFile({
        originalname: `${file.originalname.split(".")[0]}.webp`,
        buffer,
      });

      return this.fileService.saveFile(save);
    }

    const save: MFile = new MFile(file);

    return this.fileService.saveFile(save);
  }

  @Post("upload-and-trim")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  async uploadAndTrim(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse> {
    if (!file.mimetype.includes("image")) throw new BadRequestException();

    const buffer = await this.fileService.convertToWebpAndTrim(file.buffer);

    const save: MFile = new MFile({
      originalname: `${file.originalname.split(".")[0]}.webp`,
      buffer,
    });

    return this.fileService.saveFile(save);
  }

  @Post("upload-product-image")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  async uploadProductScheme(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse> {
    if (!(file.mimetype.includes("image") || file.mimetype.includes("pdf"))) throw new BadRequestException();

    if (file.mimetype.includes("pdf")) {
      const response = await this.fileService.convertPdfToPng(file.buffer);
      const imageBuffer = await readFile(response.path);
      const buffer = await this.fileService.convertToWebpAndTrim(imageBuffer);

      const save: MFile = new MFile({
        originalname: `${file.originalname.split(".")[0]}.webp`,
        buffer,
      });

      return this.fileService.saveFile(save);
    }

    const buffer = await this.fileService.convertToWebpAndTrim(file.buffer);

    const save: MFile = new MFile({
      originalname: `${file.originalname.split(".")[0]}.webp`,
      buffer,
    });

    return this.fileService.saveFile(save);
  }
}
