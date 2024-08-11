import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CategoryModule } from "@modules/uz/category/category.module";
import { ProductModule } from "@modules/uz/product/product.module";
import { CronModule } from "@modules/uz/cron/cron.module";

import { SubcategoryEntity } from "./subcategory.entity";

import { SubcategoryController } from "./subcategory.controller";

import { SubcategoryService } from "./subcategory.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubcategoryEntity], "db_uz"),
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductModule),
    forwardRef(() => CronModule),
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
