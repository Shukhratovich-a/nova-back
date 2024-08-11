import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
  AfterInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { SubcategoryEntity } from "@modules/uz/subcategory/subcategory.entity";

@Entity("categories", { orderBy: { order: "ASC" } })
export class CategoryEntity extends BaseEntity {
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

  @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category)
  subcategories: Relation<SubcategoryEntity[]>;

  @Column({ name: "order", type: "int", default: 0 })
  order: number;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @AfterInsert()
  async afterInsert() {
    this.alias = `category-${this.id + 10000}`;

    this.save();
  }
}
