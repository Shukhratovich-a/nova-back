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

import { CategoryEntity } from "@modules/eg/category/category.entity";
import { ProductEntity } from "@modules/eg/product/product.entity";

@Entity("subcategories", { orderBy: { order: "ASC" } })
export class SubcategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "alias", type: "varchar", nullable: true, unique: true })
  alias: string;

  @Column({ name: "title_ru", type: "varchar", nullable: true })
  titleRu: string;

  @Column({ name: "title_en", type: "varchar", nullable: true })
  titleEn: string;

  @Column({ name: "title_tr", type: "varchar", nullable: true })
  titleTr: string;

  @Column({ name: "title_ar", type: "varchar", nullable: true })
  titleAr: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subcategories, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "category_id" })
  category: CategoryEntity;

  @OneToMany(() => ProductEntity, (products) => products.subcategory)
  products: Relation<ProductEntity[]>;

  @Column({ name: "order", type: "int", default: 0 })
  order: number;

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
