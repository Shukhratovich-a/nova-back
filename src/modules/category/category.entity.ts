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
  AfterInsert,
  // CreateDateColumn,
  // UpdateDateColumn,
} from "typeorm";

import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

import { SubcategoryEntity } from "@modules/subcategory/subcategory.entity";

@Entity("categories")
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "alias", type: "varchar", nullable: true, unique: true })
  alias: string;

  @Column({ name: "status", type: "simple-enum", enum: StatusEnum, default: "active" })
  status: StatusEnum;

  @OneToMany(() => CategoryContentEntity, (content) => content.category, { onDelete: "CASCADE" })
  contents: Relation<CategoryContentEntity[]>;

  @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category, { onDelete: "CASCADE" })
  subcategories: Relation<SubcategoryEntity[]>;

  // @CreateDateColumn({ name: "create_at", type: "datetime" })
  // createAt: Date;

  // @UpdateDateColumn({ name: "update_at", type: "datetime" })
  // updateAt: Date;

  @AfterInsert()
  async afterInsert() {
    this.alias = `category-${this.id + 10000}`;

    this.save();
  }
}

@Entity("category_contents")
@Index(["language", "category"], { unique: true })
export class CategoryContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title", type: "varchar" })
  title: string;

  @Column({ name: "language", type: "simple-enum", enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => CategoryEntity, (category) => category.contents, { nullable: false })
  @JoinColumn({ name: "category_id" })
  category: CategoryEntity;
}
