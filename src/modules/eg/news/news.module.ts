import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NewsEntity } from "./news.entity";

import { NewsController } from "./news.controller";

import { NewsService } from "./news.service";

@Module({
  imports: [TypeOrmModule.forFeature([NewsEntity], "db_eg")],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
