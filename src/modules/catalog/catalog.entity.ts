import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("catalogs", { orderBy: { year: "DESC" } })
export class CatalogEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "title_ru", type: "varchar", nullable: true })
  titleRu: string;

  @Column({ name: "title_en", type: "varchar", nullable: true })
  titleEn: string;

  @Column({ name: "title_tr", type: "varchar", nullable: true })
  titleTr: string;

  @Column({ name: "title_ar", type: "varchar", nullable: true })
  titleAr: string;

  @Column({ name: "subtitle_ru", type: "varchar", nullable: true })
  subtitleRu: string;

  @Column({ name: "subtitle_en", type: "varchar", nullable: true })
  subtitleEn: string;

  @Column({ name: "subtitle_tr", type: "varchar", nullable: true })
  subtitleTr: string;

  @Column({ name: "subtitle_ar", type: "varchar", nullable: true })
  subtitleAr: string;

  @Column({ name: "catalog", type: "varchar" })
  catalog: string;

  @Column({ name: "year", type: "varchar" })
  year: string;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @DeleteDateColumn({ name: "delete_at", type: "datetime", nullable: true })
  deleteAt: Date;
}
