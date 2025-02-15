import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubcategoryModule } from "@modules/eg/subcategory/subcategory.module";

import { CategoryEntity } from "./category.entity";

import { CategoryController } from "./category.controller";

import { CategoryService } from "./category.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity], "db_eg"), forwardRef(() => SubcategoryModule)],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
