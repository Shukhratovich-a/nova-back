import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { SubcategoryEntity } from "@modules/subcategory/subcategory.entity";
import { DetailEntity } from "@modules/detail/detail.entity";

@Entity("products")
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "code", type: "varchar", unique: true })
  code: string;

  @Column({ name: "title_ru", type: "varchar", nullable: true })
  titleRu: string;

  @Column({ name: "title_en", type: "varchar", nullable: true })
  titleEn: string;

  @Column({ name: "title_tr", type: "varchar", nullable: true })
  titleTr: string;

  @Column({ name: "title_ar", type: "varchar", nullable: true })
  titleAr: string;

  @Column({ name: "description_ru", type: "varchar", nullable: true })
  descriptionRu: string;

  @Column({ name: "description_en", type: "varchar", nullable: true })
  descriptionEn: string;

  @Column({ name: "description_tr", type: "varchar", nullable: true })
  descriptionTr: string;

  @Column({ name: "description_ar", type: "varchar", nullable: true })
  descriptionAr: string;

  @Column({ name: "main_image", type: "varchar", nullable: true })
  mainImage: string;

  @Column({ name: "box_image", type: "varchar", nullable: true })
  boxImage: string;

  @Column({ name: "scheme_image", type: "varchar", nullable: true })
  schemeImage: string;

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
