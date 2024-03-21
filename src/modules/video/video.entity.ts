import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { ProductEntity } from "@modules/product/product.entity";

@Entity("videos")
export class VideoEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title_en", type: "varchar" })
  titleEn: string;

  @Column({ name: "title_ru", type: "varchar" })
  titleRu: string;

  @Column({ name: "title_tr", type: "varchar" })
  titleTr: string;

  @Column({ name: "title_ar", type: "varchar" })
  titleAr: string;

  @Column({ name: "video", type: "varchar" })
  video: string;

  @ManyToMany(() => ProductEntity, { nullable: true })
  @JoinTable({ name: "video_products" })
  products: Relation<ProductEntity[]>;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}
