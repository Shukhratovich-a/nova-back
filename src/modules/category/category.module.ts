import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubcategoryModule } from "@modules/subcategory/subcategory.module";

import { CategoryEntity, CategoryContentEntity } from "./category.entity";

import { CategoryController } from "./category.controller";

import { CategoryService } from "./category.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, CategoryContentEntity]), forwardRef(() => SubcategoryModule)],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
