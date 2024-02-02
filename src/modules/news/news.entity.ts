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
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  AfterInsert,
} from "typeorm";

import { NewsTypeEnum } from "@enums/news-type.enum";
import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

@Entity("news")
export class NewsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "alias", type: "varchar", nullable: true, unique: true })
  alias?: string;

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "image", type: "varchar", nullable: true })
  image?: string;

  @OneToMany(() => NewsContentEntity, (content) => content.news, { onDelete: "CASCADE" })
  contents: Relation<NewsContentEntity[]>;

  @Column({ name: "status", type: "simple-enum", enum: StatusEnum, default: "active" })
  status: StatusEnum;

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

@Entity("news_contents")
@Index(["language", "news"], { unique: true })
export class NewsContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title", type: "varchar" })
  title: string;

  @Column({ name: "subtitle", type: "varchar", nullable: true })
  subtitle: string;

  @Column({ name: "body", type: "varchar" })
  body: string;

  @Column({ name: "tag", type: "varchar" })
  tag: string;

  @Column({ name: "language", type: "simple-enum", enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => NewsEntity, (news) => news.contents, { nullable: false })
  @JoinColumn({ name: "news_id" })
  news: NewsEntity;
}
