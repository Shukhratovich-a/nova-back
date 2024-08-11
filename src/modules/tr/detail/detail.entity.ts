import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";

import { ProductEntity } from "@modules/tr/product/product.entity";
import { DetailTypeEntity } from "@modules/tr/detail-type/detail-type.entity";
import { DetailCategoryEntity } from "@modules/tr/detail-category/detail-category.entity";
import { DetailDimensionEntity } from "@modules/tr/detail-dimension/detail-dimension.entity";

@Entity("details")
export class DetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "value_en", type: "varchar", nullable: false })
  valueEn?: string;

  @Column({ name: "value_ru", type: "varchar", nullable: true })
  valueRu?: string;

  @Column({ name: "value_tr", type: "varchar", nullable: true })
  valueTr?: string;

  @Column({ name: "value_ar", type: "varchar", nullable: true })
  valueAr?: string;

  @ManyToOne(() => DetailTypeEntity, (type) => type.details, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "type_id" })
  type?: DetailTypeEntity | null;

  @ManyToOne(() => DetailCategoryEntity, (category) => category.details, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category?: DetailCategoryEntity | null;

  @ManyToOne(() => DetailDimensionEntity, (dimension) => dimension.details, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "dimension_id" })
  dimension?: DetailDimensionEntity | null;

  @ManyToOne(() => ProductEntity, (product) => product.details, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @BeforeInsert()
  afterInsert() {
    if (!this.valueRu) this.valueRu = this.valueEn;
    if (!this.valueTr) this.valueTr = this.valueEn;
    if (!this.valueAr) this.valueAr = this.valueEn;
  }
}
