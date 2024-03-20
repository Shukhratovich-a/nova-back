import { Module } from "@nestjs/common";

import { FileModule } from "./file/file.module";
import { BannerModule } from "./banner/banner.module";
import { AboutModule } from "./about/about.module";
import { CategoryModule } from "./category/category.module";
import { SubcategoryModule } from "./subcategory/subcategory.module";
import { ProductModule } from "./product/product.module";
import { DetailModule } from "./detail/detail.module";
import { ContactModule } from "./contact/contact.module";
import { CertificateModule } from "./certificate/certificate.module";
import { CatalogModule } from "./catalog/catalog.module";
import { NewsModule } from "./news/news.module";
import { TagModule } from "./tag/tag.module";
import { VideoModule } from "./video/video.module";

@Module({
  imports: [
    FileModule,
    BannerModule,
    AboutModule,
    CategoryModule,
    SubcategoryModule,
    ProductModule,
    DetailModule,
    ContactModule,
    CertificateModule,
    CatalogModule,
    NewsModule,
    TagModule,
    VideoModule,
  ],
})
export class Modules {}
