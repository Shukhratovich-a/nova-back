import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  UploadedFile,
  ParseFilePipe,
  Res,
  Param,
  StreamableFile,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Response } from "express";
import { extname, join, parse, sep } from "path";
import { path } from "app-root-path";
import { createReadStream, existsSync, mkdir } from "fs";
import { diskStorage } from "multer";
import { format } from "date-fns";

import { FileService } from "./file.service";

import { FileElementResponse } from "./dto/file-element.dto";

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
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const dateFolder = format(new Date(), "yyyy-MM-dd_HH-mm");
          const uploadFolder = `./uploads/other/${dateFolder}`;

          mkdir(uploadFolder, { recursive: true }, (error) => {
            if (error) {
              console.error("Error creating directory:", error);
            }
            cb(error, uploadFolder);
          });
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

    const url = `/${parsedPath.dir.replace(path, "").split(sep).join("/")}/${parsedPath.base}`;

    return { url, name: file.filename };
  }

  @Post("upload-product-scheme")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const dateFolder = format(new Date(), "yyyy-MM-dd_HH-mm");
          const uploadFolder = `./uploads/other/${dateFolder}`;

          mkdir(uploadFolder, { recursive: true }, (error) => {
            if (error) {
              console.error("Error creating directory:", error);
            }
            cb(error, uploadFolder);
          });
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
  async uploadProductScheme(
    @UploadedFile(new ParseFilePipe()) file: Express.Multer.File, // : Promise<FileElementResponse>
  ) {
    const parsedPath = parse(file.path);
    const url = `/${parsedPath.dir.replace(path, "").split(sep).join("/")}/${parsedPath.base}`;

    // if (file.mimetype === "application/pdf") {
    const image = await this.fileService.convertPdfToPng(url);

    console.log(image);
    // }

    return { url, name: file.filename };
  }
}
