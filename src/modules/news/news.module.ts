import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NewsContentEntity, NewsEntity } from "./news.entity";

import { NewsController } from "./news.controller";

import { NewsService } from "./news.service";

@Module({
  imports: [TypeOrmModule.forFeature([NewsEntity, NewsContentEntity])],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
