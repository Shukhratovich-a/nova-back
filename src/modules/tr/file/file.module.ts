import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";

import { join } from "path";

import { FileController } from "./file.controller";

import { FileService } from "./file.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/v2/tr/uploads",
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
