import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("certificates", { orderBy: { order: "ASC" } })
export class CertificateEntity extends BaseEntity {
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

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "certificate", type: "varchar" })
  certificate: string;

  @Column({ name: "order", type: "int", default: 1000 })
  order: number;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}
