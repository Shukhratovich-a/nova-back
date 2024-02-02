import { Module } from "@nestjs/common";

import { FileModule } from "./file/file.module";
import { BannerModule } from "./banner/banner.module";
import { CategoryModule } from "./category/category.module";
import { SubcategoryModule } from "./subcategory/subcategory.module";
import { ProductModule } from "./product/product.module";
import { DetailModule } from "./detail/detail.module";
import { ContactModule } from "./contact/contact.module";
import { CertificateModule } from "./certificate/certificate.module";
import { CatalogModule } from "./catalog/catalog.module";
import { NewsModule } from "./news/news.module";

@Module({
  imports: [
    FileModule,
    BannerModule,
    CategoryModule,
    SubcategoryModule,
    ProductModule,
    DetailModule,
    ContactModule,
    CertificateModule,
    CatalogModule,
    NewsModule,
  ],
})
export class Modules {}
