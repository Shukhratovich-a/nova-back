import { Module } from "@nestjs/common";

import { FileModule } from "./file/file.module";
import { BannerModule } from "./poster/banner.module";
import { CategoryModule } from "./category/category.module";
import { SubcategoryModule } from "./subcategory/subcategory.module";
import { ProductModule } from "./product/product.module";

@Module({ imports: [FileModule, BannerModule, CategoryModule, SubcategoryModule, ProductModule] })
export class Modules {}
