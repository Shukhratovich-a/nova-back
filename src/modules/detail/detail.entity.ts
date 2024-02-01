import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";

import { LanguageEnum } from "@enums/language.enum";

import { ProductEntity } from "@modules/product/product.entity";

@Entity("detail_categories")
export class DetailCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @OneToMany(() => DetailEntity, (detail) => detail.category)
  details: DetailEntity[];

  @OneToMany(() => DetailCategoryContentEntity, (content) => content.detailCategory)
  contents: DetailCategoryContentEntity[];
}

@Entity("detail_category_contents")
@Index(["language", "detailCategory"], { unique: true })
export class DetailCategoryContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title", type: "varchar" })
  title: string;

  @Column({ name: "language", type: "simple-enum", enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => DetailCategoryEntity, (detailCategory) => detailCategory.contents, { nullable: false })
  @JoinColumn({ name: "detail_category_id" })
  detailCategory: DetailCategoryEntity;
}

@Entity("details")
export class DetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @OneToMany(() => DetailContentEntity, (content) => content.detail)
  contents: DetailContentEntity[];

  @ManyToOne(() => ProductEntity, (product) => product.details)
  product: ProductEntity;

  @ManyToOne(() => DetailCategoryEntity, (category) => category.details, { nullable: false })
  category: DetailCategoryEntity;
}

@Entity("detail_contents")
@Index(["language", "detail"], { unique: true })
export class DetailContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", type: "varchar", nullable: true })
  name: string;

  @Column({ name: "value", type: "varchar" })
  value: string;

  @Column({ name: "language", type: "simple-enum", enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => DetailEntity, (detail) => detail.contents, { nullable: false })
  @JoinColumn({ name: "detail_id" })
  detail: DetailEntity;
}
