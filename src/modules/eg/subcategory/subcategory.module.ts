import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CategoryModule } from "@modules/eg/category/category.module";
import { ProductModule } from "@modules/eg/product/product.module";

import { SubcategoryEntity } from "./subcategory.entity";

import { SubcategoryController } from "./subcategory.controller";

import { SubcategoryService } from "./subcategory.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubcategoryEntity], "db_eg"),
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
