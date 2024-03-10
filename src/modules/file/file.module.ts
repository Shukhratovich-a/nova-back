import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { MulterModule } from "@nestjs/platform-express";

import { join } from "path";
import { path } from "app-root-path";
import { diskStorage } from "multer";

import { FileController } from "./file.controller";

import { FileService } from "./file.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(path, "uploads"),
      serveRoot: "/uploads",
    }),

    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: async (req, file, cb) => {
            const uploadFolder = join(path, "uploads", "other");
            cb(null, uploadFolder);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
          },
        }),
      }),
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
