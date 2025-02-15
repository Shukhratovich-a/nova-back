import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubcategoryModule } from "@modules/tr/subcategory/subcategory.module";

import { CategoryEntity } from "./category.entity";

import { CategoryController } from "./category.controller";

import { CategoryService } from "./category.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity], "db_tr"), forwardRef(() => SubcategoryModule)],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
