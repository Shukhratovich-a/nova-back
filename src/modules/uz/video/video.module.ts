import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductModule } from "@modules/uz/product/product.module";

import { VideoEntity } from "./video.entity";

import { VideoController } from "./video.controller";

import { VideoService } from "./video.service";

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity], "db_uz"), forwardRef(() => ProductModule)],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
