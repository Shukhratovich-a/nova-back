import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

import { LanguageEnum } from "@enums/language.enum";

@Entity("catalogs", { orderBy: { year: "DESC" } })
@Index(["language", "year"], { unique: true })
export class CatalogEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "title", type: "varchar" })
  title: string;

  @Column({ name: "subtitle", type: "varchar" })
  subtitle: string;

  @Column({ name: "catalog", type: "varchar" })
  catalog: string;

  @Column({ name: "year", type: "varchar" })
  year: string;

  @Column({ name: "language", type: "simple-enum", enum: LanguageEnum })
  language: LanguageEnum;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}
