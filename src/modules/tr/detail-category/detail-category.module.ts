import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DetailCategoryEntity } from "./detail-category.entity";

import { DetailCategoryController } from "./detail-category.controller";

import { DetailCategoryService } from "./detail-category.service";

@Module({
  imports: [TypeOrmModule.forFeature([DetailCategoryEntity], "db_tr")],
  controllers: [DetailCategoryController],
  providers: [DetailCategoryService],
  exports: [DetailCategoryService],
})
export class DetailCategoryModule {}
