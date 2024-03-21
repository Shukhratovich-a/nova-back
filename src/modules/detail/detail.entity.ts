import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Relation,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

import { ProductEntity } from "@modules/product/product.entity";

@Entity("detail_categories")
export class DetailCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title_ru", type: "varchar", nullable: true })
  titleRu: string;

  @Column({ name: "title_en", type: "varchar", nullable: true })
  titleEn: string;

  @Column({ name: "title_tr", type: "varchar", nullable: true })
  titleTr: string;

  @Column({ name: "title_ar", type: "varchar", nullable: true })
  titleAr: string;

  @OneToMany(() => DetailEntity, (detail) => detail.category, { onDelete: "CASCADE" })
  details: Relation<DetailEntity[]>;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @DeleteDateColumn({ name: "delete_at", type: "datetime", nullable: true })
  deleteAt: Date;
}

@Entity("detail_types")
export class DetailTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title_ru", type: "varchar", nullable: true })
  titleRu: string;

  @Column({ name: "title_en", type: "varchar", nullable: true })
  titleEn: string;

  @Column({ name: "title_tr", type: "varchar", nullable: true })
  titleTr: string;

  @Column({ name: "title_ar", type: "varchar", nullable: true })
  titleAr: string;

  @OneToMany(() => DetailEntity, (detail) => detail.type, { onDelete: "CASCADE" })
  details: Relation<DetailEntity[]>;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @DeleteDateColumn({ name: "delete_at", type: "datetime", nullable: true })
  deleteAt: Date;
}

@Entity("details")
export class DetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "value", type: "varchar", nullable: true })
  value: string;

  @ManyToOne(() => DetailTypeEntity, (type) => type.details, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "type_id" })
  type?: DetailTypeEntity | null;

  @ManyToOne(() => DetailCategoryEntity, (category) => category.details, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category?: DetailCategoryEntity | null;

  @ManyToOne(() => ProductEntity, (product) => product.details, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @DeleteDateColumn({ name: "delete_at", type: "datetime", nullable: true })
  deleteAt: Date;
}
