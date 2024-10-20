import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubcategoryModule } from "@modules/uz/subcategory/subcategory.module";
import { CronModule } from "@modules/uz/cron/cron.module";

import { CategoryEntity } from "./category.entity";

import { CategoryController } from "./category.controller";

import { CategoryService } from "./category.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity], "db_uz"),
    forwardRef(() => SubcategoryModule),
    forwardRef(() => CronModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}