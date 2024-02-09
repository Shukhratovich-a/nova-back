import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DetailCategoryEntity, DetailEntity, DetailTypeEntity } from "./detail.entity";

import { DetailController, DetailTypeController, DetailCategoryController } from "./detail.controller";

import { DetailService, DetailTypeService, DetailCategoryService } from "./detail.service";

@Module({
  imports: [TypeOrmModule.forFeature([DetailCategoryEntity, DetailTypeEntity, DetailEntity])],
  controllers: [DetailController, DetailTypeController, DetailCategoryController],
  providers: [DetailService, DetailTypeService, DetailCategoryService],
  exports: [DetailService, DetailTypeService, DetailCategoryService],
})
export class DetailModule {}
