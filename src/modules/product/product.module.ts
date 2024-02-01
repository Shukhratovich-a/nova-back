import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductEntity, ProductContentEntity, ProductImageEntity } from "./product.entity";

import { DetailModule } from "@modules/detail/detail.module";
import { SubcategoryModule } from "@modules/subcategory/subcategory.module";

import { ProductController } from "./product.controller";

import { ProductService } from "./product.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductContentEntity, ProductImageEntity]),
    forwardRef(() => SubcategoryModule),
    forwardRef(() => DetailModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
