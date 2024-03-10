import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { MulterModule } from "@nestjs/platform-express";

import { join } from "path";
import { path } from "app-root-path";
import { diskStorage } from "multer";
import { format } from "date-fns";
import { ensureDir } from "fs-extra";

import { FileController } from "./file.controller";

import { FileService } from "./file.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(path, "uploads"),
      serveRoot: "/uploads",
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
