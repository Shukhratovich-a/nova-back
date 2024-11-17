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

import { ProductEntity } from "@modules/tr/product/product.entity";

@Entity("installations")
export class InstallationEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title_en", type: "varchar", nullable: true })
  titleEn: string;

  @Column({ name: "title_ru", type: "varchar", nullable: true })
  titleRu: string;

  @Column({ name: "title_tr", type: "varchar", nullable: true })
  titleTr: string;

  @Column({ name: "title_ar", type: "varchar", nullable: true })
  titleAr: string;

  @Column({ name: "installation", type: "varchar" })
  installation: string;

  @ManyToMany(() => ProductEntity, { nullable: true })
  @JoinTable({ name: "installation_products" })
  products: Relation<ProductEntity[]>;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}
