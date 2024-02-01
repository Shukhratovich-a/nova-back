import {
  Entity,
  BaseEntity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { ImageTypeEnum } from "@enums/image-type.enum";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { SubcategoryEntity } from "@modules/subcategory/subcategory.entity";
import { DetailEntity } from "@modules/detail/detail.entity";

@Entity("products")
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "code", type: "varchar", unique: true })
  code: string;

  @Column({ name: "status", type: "simple-enum", enum: StatusEnum, default: "active" })
  status: StatusEnum;

  @OneToMany(() => ProductContentEntity, (contents) => contents.product, { onDelete: "CASCADE" })
  contents: Relation<ProductContentEntity[]>;

  @OneToMany(() => ProductImageEntity, (images) => images.product, { onDelete: "CASCADE" })
  images: Relation<ProductImageEntity[]>;

  @OneToMany(() => DetailEntity, (detail) => detail.product, { onDelete: "CASCADE" })
  details: Relation<DetailEntity[]>;

  @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.products, { nullable: false })
  @JoinColumn({ name: "subcategory_id" })
  subcategory: SubcategoryEntity;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}

@Entity("product_contents")
@Index(["language", "product"], { unique: true })
export class ProductContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title", type: "varchar" })
  title: string;

  @Column({ name: "description", type: "varchar" })
  description: string;

  @Column({ name: "language", type: "simple-enum", enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => ProductEntity, (product) => product.contents, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
}

@Entity("product_images")
@Index(["type", "product"], { unique: true })
export class ProductImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "jpg_path", type: "varchar" })
  jpgPath: string;

  @Column({ name: "webp_path", type: "varchar" })
  webpPath: string;

  @Column({ name: "type", type: "simple-enum", enum: ImageTypeEnum })
  type: ImageTypeEnum;

  @ManyToOne(() => ProductEntity, (product) => product.images, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
}
