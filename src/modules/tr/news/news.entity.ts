import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  Relation,
  BeforeInsert,
  AfterInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { NewsTypeEnum } from "@enums/news-type.enum";

import { TagEntity } from "@modules/tr/tag/tag.entity";

@Entity("news", { orderBy: { createAt: "ASC" } })
export class NewsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "alias", type: "varchar", nullable: true, unique: true })
  alias?: string;

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "image", type: "varchar", nullable: true })
  image?: string;

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

  @Column({ name: "body_ru", type: "varchar", nullable: true })
  bodyRu: string;

  @Column({ name: "body_en", type: "varchar", nullable: true })
  bodyEn: string;

  @Column({ name: "body_tr", type: "varchar", nullable: true })
  bodyTr: string;

  @Column({ name: "body_ar", type: "varchar", nullable: true })
  bodyAr: string;

  @ManyToMany(() => TagEntity, { nullable: true })
  @JoinTable({ name: "news_tags" })
  tags: Relation<TagEntity[]>;

  @Column({ name: "type", type: "simple-enum", enum: NewsTypeEnum, default: "hor" })
  type: NewsTypeEnum;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @BeforeInsert()
  async beforeInsert() {
    const aliasDto = {
      content: this.alias,
      unique: Date.now(),
    };

    this.alias = JSON.stringify(aliasDto);
  }

  @AfterInsert()
  async afterInsert() {
    const alias = JSON.parse(this.alias).content;

    if (alias) {
      this.alias = `${alias}-${this.id + 10000}`;
    } else {
      this.alias = `alias-${this.id + 10000}`;
    }
    this.save();
  }
}
