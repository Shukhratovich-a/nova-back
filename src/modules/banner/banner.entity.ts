import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("banners")
export class BannerEntity extends BaseEntity {
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

  @Column({ name: "description_ru", type: "varchar", nullable: true })
  descriptionRu: string;

  @Column({ name: "description_en", type: "varchar", nullable: true })
  descriptionEn: string;

  @Column({ name: "description_tr", type: "varchar", nullable: true })
  descriptionTr: string;

  @Column({ name: "description_ar", type: "varchar", nullable: true })
  descriptionAr: string;

  @Column({ name: "subtitle_ru", type: "varchar", nullable: true })
  subtitleRu: string;

  @Column({ name: "subtitle_en", type: "varchar", nullable: true })
  subtitleEn: string;

  @Column({ name: "subtitle_tr", type: "varchar", nullable: true })
  subtitleTr: string;

  @Column({ name: "subtitle_ar", type: "varchar", nullable: true })
  subtitleAr: string;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}
