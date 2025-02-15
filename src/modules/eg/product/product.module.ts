import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductEntity } from "./product.entity";

import { DetailModule } from "@modules/eg/detail/detail.module";
import { SubcategoryModule } from "@modules/eg/subcategory/subcategory.module";
import { PdfModule } from "@modules/eg/pdf/pdf.module";

import { ProductController } from "./product.controller";

import { ProductService } from "./product.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity], "db_eg"),
    forwardRef(() => SubcategoryModule),
    forwardRef(() => DetailModule),
    forwardRef(() => PdfModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
