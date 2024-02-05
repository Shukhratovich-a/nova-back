import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation,
  AfterInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { StatusEnum } from "@enums/status.enum";

import { CategoryEntity } from "@modules/category/category.entity";
import { ProductEntity } from "@modules/product/product.entity";

@Entity("subcategories")
export class SubcategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "alias", type: "varchar", nullable: true, unique: true })
  alias: string;

  @Column({ name: "status", type: "simple-enum", enum: StatusEnum, default: "active" })
  status: StatusEnum;

  @Column({ name: "title_ru", type: "varchar", nullable: true })
  titleRu: string;

  @Column({ name: "title_en", type: "varchar", nullable: true })
  titleEn: string;

  @Column({ name: "title_tr", type: "varchar", nullable: true })
  titleTr: string;

  @Column({ name: "title_ar", type: "varchar", nullable: true })
  titleAr: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subcategories, { nullable: false })
  @JoinColumn({ name: "category_id" })
  category: CategoryEntity;

  @OneToMany(() => ProductEntity, (products) => products.subcategory, { onDelete: "CASCADE" })
  products: Relation<ProductEntity[]>;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @AfterInsert()
  async afterInsert() {
    this.alias = `subcategory-${Number(this.id) + 10000}`;

    this.save();
  }
}
