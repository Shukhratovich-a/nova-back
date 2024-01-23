import { Controller, UseInterceptors, Post, UploadedFile, ParseFilePipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { FileService } from "./file.service";

import { FileElementResponse } from "./dto/file-element.dto";

import { MFile } from "./mfile.class";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

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
