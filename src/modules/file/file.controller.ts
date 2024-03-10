import { Controller, UseInterceptors, Get, Post, UploadedFile, ParseFilePipe, Res, Param, StreamableFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Response } from "express";
import { extname, join } from "path";
import { createReadStream, ensureDir } from "fs-extra";
import { diskStorage } from "multer";
import { format } from "date-fns";
import { path } from "app-root-path";

@Controller("file")
export class FileController {
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
          const dateFolder = format(new Date(), "yyyy-MM-dd_kk-mm");
          const uploadFolder = join(path, "uploads", "other", dateFolder);
          await ensureDir(uploadFolder);

          cb(null, uploadFolder);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File) {
    console.log(file);
    return { message: "File uploaded successfully!", filename: file.filename };
  }
}
