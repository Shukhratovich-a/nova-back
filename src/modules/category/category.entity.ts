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
  DeleteDateColumn,
} from "typeorm";

import { SubcategoryEntity } from "@modules/subcategory/subcategory.entity";

@Entity("categories")
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

  @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category, { onDelete: "CASCADE" })
  subcategories: Relation<SubcategoryEntity[]>;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @DeleteDateColumn({ name: "delete_at", type: "datetime", nullable: true })
  deleteAt: Date;

  @AfterInsert()
  async afterInsert() {
    this.alias = `category-${this.id + 10000}`;

    this.save();
  }
}
